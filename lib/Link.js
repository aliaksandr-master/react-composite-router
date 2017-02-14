/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { calcLocation, moveTo } from './routing';
import historyPropTypes from './historyPropTypes';
import { assertPlainObject } from './assert';


const isLeftClickEvent = (event) =>
event.button === 0;



const isModifiedEvent = (event) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);


class Link extends Component {
  static propTypes = {
    state: PropTypes.string.isRequired,
    reset: PropTypes.bool,
    params: PropTypes.object,
    reload: PropTypes.bool,
    target: PropTypes.string,
    replace: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
    className: PropTypes.string,
    activeClass: PropTypes.string,
    routerState: PropTypes.object,
    disabledClass: PropTypes.string,
    activeStateClass: PropTypes.string
  };

  static defaultProps = {
    reload: false,
    reset: false,
    replace: false,
    disabled: false
  };

  static contextTypes = {
    history: historyPropTypes(),
    routerRoutesByName: PropTypes.object.isRequired
  };

  render () {
    const {
      routerState,
      reset,
      state,
      className,
      disabled,
      children,
      reload,
      onClick,
      replace,
      target,
      activeClass,
      activeStateClass,
      disabledClass,
      params = {},
      ...otherProps
    } = this.props;

    const {
      history,
      routerRoutesByName
    } = this.context;

    if (!routerRoutesByName.hasOwnProperty(state)) {
      throw new Error(`Link state "${state}" not found`);
    }

    assertPlainObject('Link params', params);

    const location = calcLocation(routerState, routerRoutesByName[state], params, reset);
    const isActive = routerState.name === state;
    const isActiveState = isActive || routerState.name.startsWith(`${state}.`);
    const href = history.createHref(location);

    const handleClick = (event) => {
      if (onClick) {
        onClick(event);
      }

      if (
        !reload
        && !event.defaultPrevented
        && !target
        && !isModifiedEvent(event)
        && isLeftClickEvent(event)
      ) {
        event.preventDefault();

        moveTo(history, location, { replace, reload });
      }
    };

    const classNames = [
      className,
      isActive && activeClass,
      isActiveState && activeStateClass,
      disabled && disabledClass
    ].filter(Boolean).join(' ');

    return (
      <a
        {...otherProps}
        href={href}
        target={target}
        className={classNames}
        disabled={disabled}
        onClick={handleClick}
      >
        {typeof children === 'function' ? children({ isActive, disabled, isActiveState }, routerState) : children}
      </a>
    );
  }
}


export default connect(({ routerState }) => ({ routerState }), {})(Link);
