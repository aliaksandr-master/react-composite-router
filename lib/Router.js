/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import RouterContext from './RouterContext';
import { once } from './utils';
import { getRoutesByName } from './route';
import { changeStateAction } from './redux-reducer';
import { router as routerPropTypes } from './propTypes';





class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    routerState: PropTypes.shape({
      name: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired
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
    changeStateAction: PropTypes.func // from connect
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
    const { changeStateAction, history, routerState } = this.props;

    this._router.setRoutes(getRoutesByName());
    this._router.setHistory(history);
    this._router.setState(routerState);

    changeStateAction(history.location, history.action);

    this._historyCleanupListener = once(history.listen((location, action) => {
      changeStateAction(location, action);
    }));
  }

  componentWillUpdate ({ routerState }) {
    this._router.setState(routerState);
  }

  componentWillUnmount () {
    this._historyCleanupListener();
    this._router.destroy();
    this._router = null;
  }

  render () {
    const { routerState, children } = this.props;

    return routerState.name ? children : <noscript />;
  }
}



export default connect(
  ({ routerState }) => ({
    routerState
  }),
  {
    changeStateAction
  }
)(Router);
