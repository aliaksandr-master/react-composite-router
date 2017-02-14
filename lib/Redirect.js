/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { moveTo, calcLocation } from './routing';
import historyPropTypes from './historyPropTypes';
import { assertPlainObject } from './assert';



const ssr = typeof window !== 'object';



class Redirect extends Component {
  static contextTypes = {
    routerRoutesByName: PropTypes.object.isRequired,
    history: historyPropTypes()
  };

  static propTypes = {
    reset: PropTypes.bool,
    state: PropTypes.string.isRequired,
    reload: PropTypes.bool,
    params: PropTypes.object,
    replace: PropTypes.bool,
    routerState: PropTypes.object
  };

  static defaultProps = {
    reset: false,
    reload: false,
    replace: true
  };

  render () {
    return null;
  }

  componentWillMount () {
    if (ssr) {
      this._redirect();
    }
  }

  componentDidMount () {
    if (!ssr) {
      this._redirect();
    }
  }

  _redirect () {
    const { history, routerRoutesByName } = this.context;
    const { replace, reload, state, reset, params = {}, routerState } = this.props;

    if (!routerRoutesByName.hasOwnProperty(state)) {
      throw new Error(`Redirection state "${state}" not found`);
    }

    assertPlainObject('Redirection params', params);

    const location = calcLocation(routerState, routerRoutesByName[state], params, reset);

    moveTo(history, location, { replace, reload });
  }
}



export default connect(({ routerState }) => ({ routerState }))(Redirect);
