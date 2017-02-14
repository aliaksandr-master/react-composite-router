/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import connectRouter from './connect';
import { router as routerPropTypes } from './propTypes';
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
    router: routerPropTypes.isRequired
  };

  render () {
    const {
      routerState, // omit it from otherProps
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
      router
    } = this.context;

    assertPlainObject('Link: params', params);

    const currentState = router.getState();

    const location = router.calcLocation(state, params, { reset });
    const isActive = currentState.name === state;
    const isActiveState = isActive || currentState.name.startsWith(`${state}.`);
    const href = router.createHref(location);

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

        router.moveTo(location, { replace, reload });
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
        {
          typeof children === 'function'
            ? children({ isActive, disabled, isActiveState }, currentState)
            : children
        }
      </a>
    );
  }
}


export default connectRouter()(Link);
