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

  render () {
    const { name, children, render, props = {} } = this.props;
    const { router } = this.context;

    if (process.env.NODE_ENV !== 'production') { // eslint-disable-line no-process-env
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

    return children ? children(currentState.params, currentState.name) : null;
  }

  _offRouter () {}

  componentWillMount () {
    const { router } = this.context;

    this._offRouter = router.onStateChange(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount () {
    this._offRouter();
  }
}



export default Slot;
