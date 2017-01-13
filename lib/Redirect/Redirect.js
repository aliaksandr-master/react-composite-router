/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { moveTo, calcLocation } from '../routing';
import historyPropTypes from '../historyPropTypes';



const ssr = typeof window !== 'object';



class Redirect extends Component {
  static contextTypes = {
    routerRoutesByName: PropTypes.object.isRequired,
    history: historyPropTypes()
  };

  static propTypes = {
    routeState: PropTypes.object.isRequired,
    state: PropTypes.string.isRequired,
    params: PropTypes.object,
    replace: PropTypes.bool,
    reload: PropTypes.bool
  };

  static defaultProps = {
    replace: true,
    reload: false
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
    const { history, routerRoutesByName, routerState } = this.context;
    const { replace, reload, state, params } = this.props;

    const location = calcLocation(routerRoutesByName, state, routerState.params, params);

    moveTo(history, location, { replace, reload });
  }
}



export default connect(({ routerState }) => ({ routerState }))(Redirect);
