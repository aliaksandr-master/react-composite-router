import React, { Component } from 'react';
import { router as routerPropTypes } from './propTypes';


export default () => (Target) => {

  return class extends Component { // eslint-disable-line react/prefer-stateless-function
    static displayName = `connectRouter(${Target.displayName || Target.name})`;

    static contextTypes = {
      router: routerPropTypes.isRequired
    };

    componentWillMount () {
      const { router } = this.context;

      this._offRouter = router.onStateChange(() => {
        this.forceUpdate();
      });
    }

    componentWillUnmount () {
      this._offRouter();
    }

    render () {
      return <Target {...this.props} />;
    }
  };
};
