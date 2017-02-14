/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import once from 'lodash/once';
import { getRoutesByName } from './routing';
import { changeLocationAction } from './redux-reducer';
import historyPropTypes from './historyPropTypes';




class Router extends Component {
  static propTypes = {
    history: historyPropTypes(),
    changeLocationAction: PropTypes.func // from connect
  };

  static childContextTypes = {
    history: historyPropTypes(),
    routerRoutesByName: PropTypes.object.isRequired
  };

  getChildContext () {
    return {
      history: this.props.history,
      routerRoutesByName: getRoutesByName()
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
}



export default connect(
  ({ routerState }) => ({
    routerState
  }),
  {
    changeLocationAction
  }
)(Router);
