import once from 'lodash/once';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import { assertAvailableProps } from './assert';
import FakeHistory from './FakeHistory';
import EE from './EE';
import Route from './Route';



export default class RouterContext {
  constructor () {
    this.history = new FakeHistory();

    this._listenHistory(this.history);

    this._stateEmitter = new EE();

    this.state = {
      name: '',
      params: {},
      composition: {}
    };

    this.location = { // there is separated location object because history might be in inconsistent state with route
      pathname: '',
      hash: '',
      search: ''
    };

    this.routes = [];
    this.routesByName = {};

    this._hooks = [];
  }

  destroy () {
    this._historyCleanupListener();
    this._stateEmitter.destroy();
    this.location = {};
    this.history = null;
    this.state = {};
    this.routes = [];
    this.routesByName = {};
    this._hooks = [];
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

    this._listenHistory(history);
  }

  _listenHistory (history) {
    if (this._historyCleanupListener) {
      this._historyCleanupListener();
    }

    this._historyCleanupListener = once(history.listen((location, action) => {
      this.setLocation(location, action);
    }));
  }

  getLocation () {
    return this.location;
  }

  appendHook (hookFunction) {
    this._hooks = [ ...this._hooks, hookFunction ]; // subscribe

    return once(() => {
      this._hooks = this._hooks.filter((callback) => callback !== hookFunction); // unsubscribe
    });
  }

  applyHooks (nextStateName, nextStateParams) {
    return Promise.all(this._hooks.map((hook) => hook(nextStateName, nextStateParams)));
  }

  setLocation (location, action) {
    const state = this.searchStateByLocation(location, action);

    if (!state) {
      window.console && console.error && console.error(`Router: state is not defined (location: ${JSON.stringify(location)})`); // eslint-disable-line no-console, no-unused-expressions
      return; // not found. rollback to previous state
    }

    if (!this._hooks.length) {
      this.setState(state.name, state.params);
    } else {
      this.applyHooks(state.name, state.params).then(() => {
        this.setState(state.name, state.params);
      });
    }
  }

  setRoutes (routes) {
    forEach(routes, (route) => {
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
      window.console && console.info && console.info('Router: state is the same'); // eslint-disable-line no-console, no-unused-expressions
      return; // state is equal. nothing to do
    }

    if (!this.routesByName.hasOwnProperty(name)) {
      throw new Error(`invalid state name "${name}"`);
    }

    this.state = {
      name,
      params,
      composition: this.routesByName[name].slots
    };

    this.location = this.calcLocation(name, params);

    this._stateEmitter.publish(name, params);
  }

  onStateChange (listenerFunc) {
    return this._stateEmitter.subscribe(listenerFunc);
  }

  moveTo (location, { reload = false, replace = false } = {} /*{ replace, reload }*/) {
    if (!location) {
      throw new Error('location is empty');
    }

    if (!reload) {
      if (replace) {
        this.history.replace(location);
      } else {
        this.history.push(location);
      }

      return;
    }

    window.location.href = this.history.createHref(location);
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

    if (process.env.NODE_ENV !== 'production') { // eslint-disable-line no-process-env
      assertAvailableProps(route.availableParams, 'route params', params);
    }

    if (route.reroute) {
      const newState = route.reroute({ name: route.name, params }, { name: this.state.name, params: this.state.params });

      if (newState !== undefined) {
        if (this.routesByName.hasOwnProperty(newState.name)) {
          const newRoute = this.routesByName[newState.name];

          return newRoute.calcLocation(Object.assign({}, newRoute.params, newState.params || {}));
        }

        throw new Error('invalid route after rerouting');
      }
    }

    return route.calcLocation(params);
  }

  getState () {
    return this.state;
  }
}
