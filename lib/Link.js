/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import connectRouter from './connect';
import referringRouter, { statePropTypes } from './referring';
import { router as routerPropTypes } from './propTypes';
import { compose } from './utils';




const isLeftClickEvent = (event) =>
  event.button === 0;



const isModifiedEvent = (event) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);



class Link extends Component {
  static propTypes = {
    state: statePropTypes,
    target: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    activeClass: PropTypes.string,
    disabledClass: PropTypes.string,
    activeStateClass: PropTypes.string
  };

  static defaultProps = {
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
      && !isModifiedEvent(event)
      && isLeftClickEvent(event)
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
      activeStateClass,
      disabledClass,
      ...otherProps
    } = this.props;

    const className = [
      this.props.className,
      state.isActive && activeClass,
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


export default compose(
  connectRouter(),
  referringRouter()
)(Link);
