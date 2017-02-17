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

      calcRoutingState (reset, state, reload, replace, params) {
        const hash = [ reset, state, reload, replace, JSON.stringify(params) ].toString();

        if (this._map == null) {
          this._map = new Map();
        }

        if (this._map.has(hash)) {
          return this._map.get(hash);
        }

        const router = this.context.router;

        assertPlainObject('Link: params', params);

        const currentState = router.getState();
        const currentLocation = router.getLocation();
        const location = router.calcLocation(state, params, { reset });
        const isActive =
          currentState.name === state
          && currentLocation.pathname === location.pathname
          && currentLocation.hash === location.hash
          && currentLocation.search === location.search;

        const routingState = {
          href: router.createHref(location),
          name: state,
          current: {
            name: currentState.name,
            params: currentState.params
          },
          params,
          isActive,
          isActiveState: isActive || currentState.name === state || currentState.name.startsWith(`${state}.`),
          apply () {
            router.moveTo(location, { replace, reload });
          }
        };

        this._map.set(hash, routingState);

        return routingState;
      }

      render () {
        const { reset, state, reload, replace, params, ...otherProps } = this.props;

        return <Target {...otherProps} state={this.calcRoutingState(reset, state, reload, replace, params)} />;
      }
    }
  );
};
