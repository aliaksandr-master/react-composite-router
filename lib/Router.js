/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import RouterContext from './RouterContext';
import { router as routerPropTypes, routes as routesPropTypes } from './propTypes';





class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    routes: routesPropTypes,
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
    }).isRequired
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

  componentWillMount () {
    const { history, routes, onChange } = this.props;

    this._router.onStateChange((name, params) => {
      if (onChange) {
        onChange(name, params);
      }

      this.forceUpdate();
    });

    this._router.setRoutes(routes);
    this._router.setHistory(history);
  }

  componentWillUnmount () {
    this._router.destroy();
    this._router = null;
  }

  render () {
    const { children } = this.props;

    return this._router.getState().name ? children : <noscript />;
  }
}



export default Router;
