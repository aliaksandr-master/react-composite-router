/* eslint-env browser */

import React, { PropTypes } from 'react';
import isFunction from 'lodash/isFunction';
import { throwHiddenError } from '../util/log';
import { calcLocation } from '../routing';
import { assertTrimmedNonEmptyString, assertPlainObject, assertAvailableValues, assertAvailableProps } from '../util/assert';


const isLeftClickEvent = (event) =>
event.button === 0;



const isModifiedEvent = (event) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);



const Link = (props, context) => {
  const { to, className, disabled, children, reload, onClick, replace, target, activeClass, activeStateClass, disabledClass, params = {}, ...otherProps } = props;
  const { routerState, routerRoutesByName, history } = context;

  if (process.env.NODE_ENV !== 'production') {
    assertTrimmedNonEmptyString('Link to', to);

    if (target != null) {
      assertAvailableValues([ '_blank' ], 'Link target', target);
    }

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
    const route = routerRoutesByName[to];
    const routeParams = { ...route.defaultParams, ...routerState.params, ...params };

    if (process.env.NODE_ENV !== 'production') {
      assertAvailableProps(route.availableParams, 'Link params', params);
    }

    location = calcLocation(route, routeParams);

    isActive = history.location.pathname === location.pathname;
    isActiveState = route.name === to || route.name.startsWith(to);

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

      if (location) {
        if (replace) {
          history.replace(location);
        } else {
          history.push(location);
        }
      }
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
  target: PropTypes.string,
  replace: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  activeStateClass: PropTypes.string,
  activeClass: PropTypes.string,
  disabledClass: PropTypes.string
};



Link.defaultProps = {
  reload: false,
  replace: false,
  disabled: false
};



Link.contextTypes = {
  history: React.PropTypes.object.isRequired,
  routerRoutesByName: React.PropTypes.object.isRequired,
  routerState: React.PropTypes.object.isRequired
};



export default Link;
