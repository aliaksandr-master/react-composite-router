/* eslint-env browser */

import React, { PropTypes } from 'react';
import isFunction from 'lodash/isFunction';
import { throwHiddenError } from '../util/log';
import { calcLocation, moveTo } from '../routing';
import { assertTrimmedNonEmptyString, assertPlainObject, assertAvailableValues, assertAvailableProps } from '../util/assert';
import historyPropTypes from '../util/historyPropTypes';


const isLeftClickEvent = (event) =>
event.button === 0;



const isModifiedEvent = (event) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);



const Link = (props) => {
  const {
    routerState,
    routerRoutesByName,
    history,
    to,
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

  if (process.env.NODE_ENV !== 'production') {
    assertTrimmedNonEmptyString('Link to', to);
    assertPlainObject('Link params', params);
  }

  let isActive = false;
  let isActiveState = false;

  let href = null;
  let location = null;

  if (!routerRoutesByName.hasOwnProperty(to)) {
    throwHiddenError(`Invalid state name "${to}" in Link[to]`);
    href = null;
    location = null;
  } else {
    location = calcLocation(routerRoutesByName[to], routerState.params, params);
    isActive = history.location.pathname === location.pathname;
    isActiveState = routerState.name === to || routerState.name.startsWith(to);
    href = history.createHref(location);
  }

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
      {isFunction(children) ? children({ isActive, disabled, isActiveState }, routerState) : children}
    </a>
  );
};



Link.propTypes = {
  to: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  params: PropTypes.object,
  reload: PropTypes.bool.isRequired,
  target: PropTypes.oneOf([ '_blank' ]),
  replace: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  activeStateClass: PropTypes.string,
  activeClass: PropTypes.string,
  disabledClass: PropTypes.string,
  history: historyPropTypes(),
  routerRoutesByName: PropTypes.object.isRequired,
  routerState: PropTypes.object.isRequired
};



Link.defaultProps = {
  reload: false,
  replace: false,
  disabled: false
};



Link.contextTypes = {
};



export default Link;
