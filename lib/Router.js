/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import once from 'lodash/once';
import { getRoutesByName, calcLocation, moveTo } from './routing';
import { changeLocationAction } from './redux-reducer';
import { router as routerPropTypes } from './propTypes';




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
      createHref: PropTypes.func.isRequired,
      listen: PropTypes.func.isRequired
    }).isRequired,
    changeLocationAction: PropTypes.func // from connect
  };

  static childContextTypes = {
    router: routerPropTypes
  };

  getChildContext () {
    return {
      router: {
        moveTo: (location, movingParams /*{ replace, reload }*/) => {
          moveTo(this.props.history, location, movingParams);
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
