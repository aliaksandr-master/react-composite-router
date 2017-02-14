import { once, each } from './utils';
import { assertAvailableProps } from './assert';
import Route from './Route';



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
    each(routes, (route) => {
      if (!(route instanceof Route)) {
        throw new TypeError('object is not instance of Route');
      }
    });

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

  calcLocation (stateName, stateParams, { reset = false } = {}) {
    if (!this.routesByName.hasOwnProperty(stateName)) {
      throw new Error(`RouterContext: state "${stateName}" not found`);
    }

    const route = this.routesByName[stateName];
    const params = route.calcParams(stateParams, this.state.params, reset);

    if (process.env.NODE_ENV !== 'production') {
      assertAvailableProps(route.availableParams, 'route params', params);
    }

    if (route.reroute) {
      const newState = route.reroute({ name: route.name, params }, { name: this.state.name, params: this.state.params });

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

    return route.calcLocation(params);
  }

  getState () {
    return this.state;
  }

  destroy () {
    this._setInitial();
  }
}
