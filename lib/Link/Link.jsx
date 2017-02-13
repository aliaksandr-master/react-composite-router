/* eslint-env browser */

import React, { PropTypes } from 'react';
import { calcLocation, moveTo } from '../routing';
import historyPropTypes from '../historyPropTypes';
import { assertPlainObject } from '../assert';


const isLeftClickEvent = (event) =>
event.button === 0;



const isModifiedEvent = (event) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);



const Link = (props) => {
  const {
    routerState,
    reset,
    routerRoutesByName,
    history,
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
  } = props;

  if (!routerRoutesByName.hasOwnProperty(state)) {
    throw new Error(`Link state "${state}" not found`);
  }

  assertPlainObject('Link params', params);

  const location = calcLocation(routerState, routerRoutesByName[state], params, reset);
  const isActive = history.location.pathname === location.pathname;
  const isActiveState = routerState.name === state || routerState.name.startsWith(state);
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
};



Link.propTypes = {
  state: PropTypes.string.isRequired,
  reset: PropTypes.bool,
  params: PropTypes.object,
  reload: PropTypes.bool,
  target: PropTypes.oneOf([ '_blank' ]),
  replace: PropTypes.bool,
  onClick: PropTypes.func,
  history: historyPropTypes(),
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
  className: PropTypes.string,
  activeClass: PropTypes.string,
  routerState: PropTypes.object,
  disabledClass: PropTypes.string,
  activeStateClass: PropTypes.string,
  routerRoutesByName: PropTypes.object
};



Link.defaultProps = {
  reload: false,
  reset: true,
  replace: false,
  disabled: false
};



Link.contextTypes = {
};



export default Link;
