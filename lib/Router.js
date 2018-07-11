import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import RouterContext from './RouterContext';
import { router as routerPropTypes, routes as routesPropTypes } from './propTypes';



class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    debug: PropTypes.bool,
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

  static defaultProps = {
    debug: false
  };

  static childContextTypes = {
    router: routerPropTypes
  };

  getChildContext () {
    return { router: this._routerContext };
  }

  constructor (...args) {
    super(...args);

    const { debug, routes } = this.props;

    this._routerContext = new RouterContext({ debug });

    this._routerContext.setRoutes(routes && isFunction(routes.getRoutes) ? routes.getRoutes() : routes);
  }

  componentDidMount () {
    const { history, onChange } = this.props;

    this._routerContext.onStateChange((name, params) => {
      if (onChange) {
        onChange(name, params);
      }

      this.forceUpdate();
    });

    if (history) {
      this._routerContext.setHistory(history);
    }
  }

  componentWillUnmount () {
    this._routerContext.destroy();
    this._routerContext = null;
  }

  render () {
    return this.props.children;
  }
}



export default Router;
