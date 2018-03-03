import React, { Component } from 'react';
import PropTypes from 'prop-types';
import startsWith from 'lodash/startsWith';
import omit from 'lodash/omit';
import { router as routerPropTypes } from './propTypes';
import { assertPlainObject, assertTrimmedNonEmptyString, assertBoolean } from './assert';



export const statePropTypes = PropTypes.shape({
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  apply: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isActiveState: PropTypes.bool.isRequired
});


const hasPathSegments = (actualPath, compPath) =>
  startsWith(`${actualPath.replace(/\//g, '#/')}#`, `${compPath.replace(/\//g, '#/')}#`);


const defaultMapProps = (props) => (props);


export default (stateProp = 'state', mapProps = null) => (Target) => {
  return class extends Component {
    static displayName = `referring(${Target.displayName || Target.name})`;

    static contextTypes = {
      router: routerPropTypes.isRequired
    };

    recalcRoutingState (props) {
      const router = this.context.router;
      const { state, params = {}, reset = false, reload = false, replace = false } = (mapProps || defaultMapProps)(props);

      assertBoolean('reset', reset);
      assertBoolean('reload', reload);
      assertBoolean('replace', replace);
      assertPlainObject('params', params);
      assertTrimmedNonEmptyString('state', state);

      const currentState = router.getState();
      const currentLocation = router.getLocation();
      const location = router.calcLocation(state, params, { reset });
      const isActive =
        currentState.name === state
        && currentLocation.pathname === location.pathname
        && currentLocation.hash === location.hash
        && currentLocation.search === location.search;

      this._routingState = {
        href: router.createHref(location),
        name: state,
        current: {
          name: currentState.name,
          params: currentState.params
        },
        params,
        isActive,
        isActivePath: isActive || hasPathSegments(location.pathname, currentLocation.pathname),
        isActiveState: isActive || currentState.name === state || currentState.name.startsWith(`${state}.`),
        apply (additionalParams = null) {
          let newLocation = location;

          if (additionalParams !== null) {
            newLocation = router.calcLocation(state, { ...params, ...additionalParams }, { reset });
          }

          router.moveTo(newLocation, { replace, reload });
        }
      };
    }

    _offRouter () {}

    componentWillMount () {
      this.recalcRoutingState(this.props);

      const { router } = this.context;

      this._offRouter = router.onStateChange(() => {
        this.forceUpdate();
      });
    }

    componentWillUnmount () {
      this._offRouter();
    }

    componentWillUpdate (props) {
      this.recalcRoutingState(props);
    }

    render () {
      const state = {
        [stateProp]: this._routingState
      };

      let props = this.props;

      if (!mapProps) { // TODO: deprecated
        props = omit(props, [ 'state', 'params', 'reload', 'reset', 'replace' ]);
      }

      return (
        <Target {...props} {...state} />
      );
    }
  };
};
