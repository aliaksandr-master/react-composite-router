import { once, each, isEqual } from './utils';
import { assertAvailableProps } from './assert';
import Route from './Route';



export default class RouterContext {
  constructor () {
    this._setInitial();
  }

  _setInitial () {
    this.history = {};
    this.state = {
      name: '',
      params: {},
      composition: {}
    };

    this.routes = [];
    this.routesByName = {};
    this._changeListeners = [];
  }

  searchStateByLocation (location, action) {
    const route = this.routes.find((route) => route.isMatch(location, action));

    if (!route) {
      return null;
    }

    return {
      name: route.name,
      params: route.parseLocationParams(location)
    };
  }

  setHistory (history) {
    this.history = history;

    this.setLocation(history.location, history.action);

    this._historyCleanupListener = once(history.listen((location, action) => {
      this.setLocation(location, action);
    }));
  }

  setLocation (location, action) {
    const state = this.searchStateByLocation(location, action);

    if (!state) {
      window.console && console.error && console.error(`state is not defined (location: ${JSON.stringify(location)})`); // eslint-disable-line no-console, no-unused-expressions
      return; // not found. rollback to previous state
    }

    this.setState(state.name, state.params);
  }

  setRoutes (routes) {
    each(routes, (route) => {
      if (!(route instanceof Route)) {
        throw new TypeError('object is not instance of Route');
      }
    });

    this.routesByName = routes;

    this.routes = Object.keys(routes)
      .sort((name1, name2) => {
        const segmentsLen1 = name1.split('.').length;
        const segmentsLen2 = name2.split('.').length;

        if (segmentsLen1 > segmentsLen2) {
          return -1;
        }

        return segmentsLen1 < segmentsLen2 ? 1 : 0;
      })
      .map((name) => routes[name]);
  }

  setState (name, params = {}) {
    if (this.state.name === name && isEqual(this.state.params, params)) {
      return; // state is equal. nothing to do
    }

    this.state = {
      name,
      params,
      composition: this.routesByName.hasOwnProperty(name) ? this.routesByName[name].slots || {} : {}
    };

    this._triggerStateChange();
  }

  _triggerStateChange () {
    if (!this._changeListeners || !this._changeListeners.length) {
      return;
    }

    this._changeListeners.forEach((listener) => {
      listener(this.state.name, this.state.params);
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
            params: Object.assign({}, newRoute.params, newState.params || {})
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
    if (this._historyCleanupListener) {
      this._historyCleanupListener();
    }
    this._setInitial();
  }
}
