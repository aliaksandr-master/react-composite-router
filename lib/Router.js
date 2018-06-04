import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import RouterContext from './RouterContext';
import { router as routerPropTypes, routes as routesPropTypes } from './propTypes';



class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    routes: PropTypes.oneOfType([ routesPropTypes.isRequired, PropTypes.shape({ getRoutes: PropTypes.func.isRequired }) ]).isRequired,
    history: PropTypes.shape({ // instance of history.js
      action: PropTypes.string,
      location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string
      }).isRequired,
      push: PropTypes.func.isRequired,
      listen: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired
    })
  };

  static childContextTypes = {
    router: routerPropTypes
  };

  getChildContext () {
    return { router: this._router };
  }

  constructor (...args) {
    super(...args);

    this._router = new RouterContext();
  }

  UNSAFE_componentWillMount () {
    const { history, routes, onChange } = this.props;

    this._router.onStateChange((name, params) => {
      if (onChange) {
        onChange(name, params);
      }

      this.forceUpdate();
    });

    if (routes && isFunction(routes.getRoutes)) {
      this._router.setRoutes(routes.getRoutes());
    } else {
      this._router.setRoutes(routes);
    }

    if (history) {
      this._router.setHistory(history);
    }
  }

  componentWillUnmount () {
    this._router.destroy();
    this._router = null;
  }

  render () {
    return this.props.children;
  }
}



export default Router;
