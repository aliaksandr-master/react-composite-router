import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    children: PropTypes.func
  };

  constructor (...args) {
    super(...args);

    this.state = { version: 0 };
  }

  render () {
    const { name, children, render, props = {} } = this.props;
    const { router } = this.context;

    if (process.env.NODE_ENV !== 'production') { // eslint-disable-line no-process-env
      assertTrimmedNonEmptyString('Slot name', name);
      assertPlainObject('Slot props', props);
    }

    const composition = router.getCurrentComposition();

    if (router.debug) {
      window.console && console.log && console.log('ROUTER:: SLOT RENDER', composition); // eslint-disable-line no-console, no-unused-expressions
    }

    if (composition.hasOwnProperty(name)) {
      const ViewComponent = composition[name];

      if (!render) {
        return (
          <ViewComponent {...props} />
        );
      }

      return render(ViewComponent);
    }

    return children ? children() : null;
  }
}



export default Slot;
