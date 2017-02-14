/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import connectRouter from './connect';
import { router as routerPropTypes } from './propTypes';
import { assertPlainObject } from './assert';



const ssr = typeof window !== 'object';



class Redirect extends Component {
  static contextTypes = {
    router: routerPropTypes.isRequired
  };

  static propTypes = {
    reset: PropTypes.bool,
    state: PropTypes.string.isRequired,
    reload: PropTypes.bool,
    params: PropTypes.object,
    replace: PropTypes.bool
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
    const { router } = this.context;
    const { replace, reload, state, reset, params = {} } = this.props;

    assertPlainObject('Redirect: params', params);

    const location = router.calcLocation(state, params, { reset });

    router.moveTo(location, { replace, reload });
  }
}



export default connectRouter()(Redirect);
