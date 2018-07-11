import React, { Component } from 'react';
import { router as routerPropTypes } from './propTypes';



export default (stateProp = 'routerState') => (Target) => class extends Component {
  static displayName = `routerState(${Target.displayName || Target.name})`;

  static contextTypes = {
    router: routerPropTypes.isRequired
  };

  shouldComponentUpdate () {
    return true;
  }

  _offRouter () {}

  componentDidMount () {
    const { router } = this.context;

    this._offRouter = router.onStateChange(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount () {
    this._offRouter();
  }

  render () {
    const props = this.props;

    const state = {
      [stateProp]: this.context.router.getState()
    };

    return (
      <Target
        {...props}
        {...state}
      />
    );
  }
};
