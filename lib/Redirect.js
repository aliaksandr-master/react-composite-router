import React, { Component } from 'react';
import referringRouter, { statePropTypes } from './referring';



const ssr = typeof window !== 'object'; // eslint-disable-line lodash/prefer-lodash-typecheck



class Redirect extends Component {

  static propTypes = {
    _$state: statePropTypes
  };

  render () {
    return <noscript />;
  }

  UNSAFE_componentWillMount () {
    if (ssr) {
      this.props._$state.apply();
    }
  }

  componentDidMount () {
    if (!ssr) {
      this.props._$state.apply();
    }
  }
}



export default referringRouter('_$state', ({ replace = true, ...props }) => ({ replace, ...props }))(Redirect);
