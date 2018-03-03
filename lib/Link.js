import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import referringRouter, { statePropTypes } from './referring';
import { router as routerPropTypes } from './propTypes';



class Link extends Component {
  static propTypes = {
    _$state: statePropTypes,
    target: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.any,
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
      _$state
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
        _$state.apply();
      }
    }
  }

  render () {
    const {
      _$state,
      activeClass,
      activePathClass,
      activeStateClass,
      disabledClass,
      children,
      state, // eslint-disable-line react/prop-types
      params, // eslint-disable-line react/prop-types
      reload, // eslint-disable-line react/prop-types
      reset, // eslint-disable-line react/prop-types
      replace, // eslint-disable-line react/prop-types
      ...otherProps
    } = this.props;

    const className = [
      this.props.className,
      _$state.isActive && activeClass,
      _$state.isActivePath && activePathClass,
      _$state.isActiveState && activeStateClass,
      this.props.disabled && disabledClass
    ].filter(Boolean).join(' ');

    if (isFunction(children)) {
      return children({
        ...otherProps,
        href: _$state.href,
        className,
        onClick: this.handleClick,
        state: this._$state
      });
    }

    return (
      <a
        {...otherProps}
        children={children}
        href={_$state.href}
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}


export default referringRouter('_$state', (props) => props)(Link);
