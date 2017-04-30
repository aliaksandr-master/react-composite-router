/* eslint-env browser */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectRouter from './connect';
import { router as routerParams } from './propTypes';
import { assertTrimmedNonEmptyString, assertPlainObject } from './assert';




class Slot extends Component {
  static contextTypes = {
    router: routerParams.isRequired
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    props: PropTypes.object,
    render: PropTypes.func,
    children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ])
  };

  render () {
    const { name, children, render, props = {} } = this.props;
    const { router } = this.context;

    if (process.env.NODE_ENV !== 'production') {
      assertTrimmedNonEmptyString('Slot name', name);
      assertPlainObject('Slot props', props);
    }

    const currentState = router.getState();

    if (currentState.composition.hasOwnProperty(name)) {
      const ViewComponent = currentState.composition[name];

      if (!render) {
        return (
          <ViewComponent {...props} />
        );
      }

      return render(ViewComponent, currentState.params, currentState.name);
    }

    if (!children) {
      return null;
    }

    if (typeof children === 'function') {
      return children(currentState.params, currentState.name);
    }

    return children;
  }
}



export default connectRouter()(Slot);
