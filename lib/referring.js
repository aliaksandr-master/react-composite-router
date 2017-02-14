import React, { Component, PropTypes } from 'react';
import { router as routerPropTypes } from './propTypes';
import { assertPlainObject } from './assert';


export const statePropTypes = PropTypes.shape({
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  apply: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isActiveState: PropTypes.bool.isRequired
});

export default () => (Target) => {

  return class extends Component { // eslint-disable-line react/prefer-stateless-function
    static displayName = `referring(${Target.displayName || Target.name})`;

    static contextTypes = {
      router: routerPropTypes.isRequired
    };

    static propTypes = {
      state: PropTypes.string.isRequired,
      reset: PropTypes.bool,
      params: PropTypes.object,
      reload: PropTypes.bool,
      replace: PropTypes.bool
    };

    static defaultProps = {
      reload: false,
      reset: false,
      replace: false,
      params: {}
    };

    recalcRoutingState () {
      const router = this.context.router;
      const {
        reset,
        state,
        reload,
        replace,
        params,
        ...otherProps
      } = this.props;

      assertPlainObject('Link: params', params);

      const currentState = router.getState();
      const location = router.calcLocation(state, params, { reset });
      const isActive = currentState.name === state;

      this._otherProps = otherProps;

      this._routingState = {
        href: router.createHref(location),
        name: state,
        params,
        isActive,
        isActiveState: isActive || currentState.name.startsWith(`${state}.`),
        apply () {
          router.moveTo(location, { replace, reload });
        }
      };
    }

    componentWillMount () {
      this.recalcRoutingState();
    }

    componentWillUpdate () {
      this.recalcRoutingState();
    }

    render () {
      return <Target {...this._otherProps} state={this._routingState} />;
    }
  };
};
