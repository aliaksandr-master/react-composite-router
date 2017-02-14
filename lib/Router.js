/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { once, calcSearchString } from './utils';
import { getRoutesByName } from './route';
import { changeLocationAction } from './redux-reducer';
import { router as routerPropTypes } from './propTypes';
import { assertAvailableProps } from './assert';



const calcNewState = (fromState, toRoute, withNewParams, resetParams = false) => {
  const route = toRoute;
  const routesByName = getRoutesByName();

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
      if (routesByName.hasOwnProperty(newState.name)) {
        const newRoute = routesByName[newState.name];

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
};



const calcLocation = (fromState, toRoute, withNewParams, resetParams = false) => {
  const { route, params } = calcNewState(fromState, toRoute, withNewParams, resetParams);

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
};



class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    routerState: PropTypes.shape({
      name: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      initialized: PropTypes.bool.isRequired
    }).isRequired,
    history: PropTypes.shape({ // instance of history.js
      location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string
      }).isRequired,
      push: PropTypes.func.isRequired,
      listen: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired
    }).isRequired,
    changeLocationAction: PropTypes.func // from connect
  };

  static childContextTypes = {
    router: routerPropTypes
  };

  getChildContext () {
    return {
      router: {
        moveTo: (location, { reload = false, replace = false } = {} /*{ replace, reload }*/) => {
          if (!location) {
            throw new Error('location is empty');
          }

          if (reload) {
            window.location.href = this.props.history.createHref(location);
            return;
          }

          if (replace) {
            this.props.history.replace(location);
          } else {
            this.props.history.push(location);
          }
        },

        createHref: (location) => {
          return this.props.history.createHref(location);
        },

        calcLocation: (state, params, { reset = false } = {}) => {
          const routes = getRoutesByName();

          if (!routes.hasOwnProperty(state)) {
            throw new Error(`Link state "${state}" not found`);
          }

          return calcLocation(this.props.routerState, routes[state], params, reset);
        },

        getState: () => {
          const routerState = this.props.routerState;
          const routes = getRoutesByName();

          return {
            name: routerState.name,
            params: routerState.params,
            composition: routes.hasOwnProperty(routerState.name) ? routes[routerState.name].slots : {}
          };
        }
      }
    };
  }

  componentWillMount () {
    const { changeLocationAction, history } = this.props;

    changeLocationAction(history.location, history.action);

    this._historyCleanupListener = once(history.listen((location, action) => {
      changeLocationAction(location, action);
    }));
  }

  componentWillUnmount () {
    this._historyCleanupListener();
  }

  render () {
    const { routerState, children } = this.props;

    return routerState.initialized ? children : <noscript />;
  }
}



export default connect(
  ({ routerState }) => ({
    routerState
  }),
  {
    changeLocationAction
  }
)(Router);
