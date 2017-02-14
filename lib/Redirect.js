/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import connectRouter from './connect';
import { compose } from './utils';
import referringRouter, { statePropTypes } from './referring';



const ssr = typeof window !== 'object';



class Redirect extends Component {

  static propTypes = {
    state: statePropTypes
  };

  render () {
    return <noscript />;
  }

  componentWillMount () {
    if (ssr) {
      this.props.state.apply();
    }
  }

  componentDidMount () {
    if (!ssr) {
      this.props.state.apply();
    }
  }
}



export default compose(
  connectRouter(),
  referringRouter()
)(Redirect);
