import { once, calcSearchString } from './utils';
import { assertAvailableProps } from './assert';



export default class RouterContext {
  constructor () {
    this._setInitial();
  }

  _setInitial () {
    this.history = {};
    this.state = {
      initialized: false,
      name: '',
      params: {},
      composition: {}
    };

    this.routesByName = {};
    this._changeListeners = [];
  }

  setHistory (history) {
    this.history = history;
  }

  setRoutes (routes) {
    this.routesByName = routes;
  }

  setState ({ initialized, name, params = {} }) {
    if (this.state.initialized === initialized && this.state.name === name && this.state.params === params) {
      return;
    }

    this.state = {
      name,
      params,
      initialized,
      composition: this.routesByName.hasOwnProperty(name) ? this.routesByName[name].slots || {} : {}
    };

    this._triggerStateChange();
  }

  _triggerStateChange () {
    if (!this._changeListeners || !this._changeListeners.length) {
      return;
    }

    this._changeListeners.forEach((listener) => {
      listener();
    });
  }

  onStateChange (listener) {
    this._changeListeners.push(listener);

    return once(() => {
      this._changeListeners = this._changeListeners.filter((_listener) => _listener !== listener);
      listener = null;
    });
  }

  moveTo (location, { reload = false, replace = false } = {} /*{ replace, reload }*/) {
    if (!location) {
      throw new Error('location is empty');
    }

    if (reload) {
      window.location.href = this.history.createHref(location);
      return;
    }

    if (replace) {
      this.history.replace(location);
    } else {
      this.history.push(location);
    }
  }

  createHref (location) {
    return this.history.createHref(location);
  }

  _calcNewState (fromState, toRoute, withNewParams, resetParams = false) {
    const route = toRoute;

    let params = route.availableParams.reduce((params, paramName) => {
      if (withNewParams.hasOwnProperty(paramName)) {
        params[paramName] = withNewParams[paramName];
      } else if (!resetParams && fromState.params.hasOwnProperty(paramName)) {
        params[paramName] = fromState.params[paramName];
      }

      return params;
    }, { ...route.params });

    if (route.filterParams) {
      params = route.filterParams(toRoute.name, params);
    }

    if (process.env.NODE_ENV !== 'production') {
      assertAvailableProps(route.availableParams, 'route params', params);
    }

    if (route.reroute) {
      const newState = route.reroute({ name: route.name, params }, { name: fromState.name, params: fromState.params });

      if (newState !== undefined) {
        if (this.routesByName.hasOwnProperty(newState.name)) {
          const newRoute = this.routesByName[newState.name];

          return {
            route: newRoute,
            params: {
              ...newRoute.params,
              ...(newState.params || {})
            }
          };
        }

        throw new Error('invalid route after rerouting');
      }
    }

    return {
      route,
      params
    };
  }

  calcLocation (stateName, stateParams, { reset = false } = {}) {
    if (!this.routesByName.hasOwnProperty(stateName)) {
      throw new Error(`RouterContext: state "${stateName}" not found`);
    }

    const { route, params } = this._calcNewState(this.state, this.routesByName[stateName], stateParams, reset);

    const pathname = route.pathMask.replace(/{{([^}]+)}}/g, ($0, paramName) => {
      if (params.hasOwnProperty(paramName)) {
        return params[paramName];
      }

      throw new Error(`Route param "${paramName}" was not defined for route "${route.name}"`);
    });

    const searchParams = route.searchParams.reduce((search, searchParam) => {
      if (params.hasOwnProperty(searchParam) && params[searchParam] !== route.params[searchParam]) {
        search[searchParam] = params[searchParam];
      }

      return search;
    }, {});

    const location = { pathname, hash: '', search: '' };

    if (searchParams) {
      location.search = calcSearchString(searchParams);
    }

    return location;
  }

  getState () {
    return this.state;
  }

  destroy () {
    this._setInitial();
  }
}
