/*eslint-disable react/no-unused-prop-types*/ // because it has bug in this case
import React, { Component, PropTypes } from 'react';
import { router as routerPropTypes } from './propTypes';
import connect from './connect';
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

  return connect()(
    class extends Component { // eslint-disable-line react/prefer-stateless-function
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

      recalcRoutingState (props) {
        const router = this.context.router;
        const {
          reset,
          state,
          reload,
          replace,
          params,
          ...otherProps
        } = props;

        assertPlainObject('Link: params', params);

        const currentState = router.getState();
        const currentLocation = router.getLocation();
        const location = router.calcLocation(state, params, { reset });
        const isActive =
          currentState.name === state
          && currentLocation.pathname === location.pathname
          && currentLocation.hash === location.hash
          && currentLocation.search === location.search;

        this._otherProps = otherProps;

        this._routingState = {
          href: router.createHref(location),
          name: state,
          current: {
            name: currentState.name,
            params: currentState.params
          },
          params,
          isActive,
          isActivePath: isActive || String(location.pathname).indexOf(currentLocation.pathname) === 0,
          isActiveState: isActive || currentState.name === state || currentState.name.startsWith(`${state}.`),
          apply () {
            router.moveTo(location, { replace, reload });
          }
        };
      }

      componentWillMount () {
        this.recalcRoutingState(this.props);
      }

      componentWillUpdate (props) {
        this.recalcRoutingState(props);
      }

      render () {
        return <Target {...this._otherProps} state={this._routingState} />;
      }
    }
  );
};
