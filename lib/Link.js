/* eslint-env browser */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import referringRouter, { statePropTypes } from './referring';
import { router as routerPropTypes } from './propTypes';



class Link extends Component {
  static propTypes = {
    state: statePropTypes,
    target: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    activeClass: PropTypes.string,
    disabledClass: PropTypes.string,
    activePathClass: PropTypes.string,
    activeStateClass: PropTypes.string
  };

  static contextTypes = {
    router: routerPropTypes.isRequired
  };

  constructor (...args) {
    super(...args);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    const {
      onClick,
      target,
      disabled,
      state
    } = this.props;

    if (onClick) {
      onClick(event);
    }

    if (
      !event.defaultPrevented
      && !target
      && !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // is modified event
      && event.button === 0 // is left button click
    ) {
      event.preventDefault();

      if (!disabled) {
        state.apply();
      }
    }
  }

  render () {
    const {
      state,
      activeClass,
      activePathClass,
      activeStateClass,
      disabledClass,
      ...otherProps
    } = this.props;

    const className = [
      this.props.className,
      state.isActive && activeClass,
      state.isActivePath && activePathClass,
      state.isActiveState && activeStateClass,
      this.props.disabled && disabledClass
    ].filter(Boolean).join(' ');

    return (
      <a
        {...otherProps}
        href={state.href}
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}


export default referringRouter()(Link);
