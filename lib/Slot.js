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
    children: PropTypes.func,
    renderError: PropTypes.func
  };

  constructor (...args) {
    super(...args);

    this.state = { hasError: false };

    this._error = null;
    this._errorInfo = null;

    if (this.props.renderError) {
      this.componentDidCatch = (error, errorInfo) => {
        this._error = error;
        this._errorInfo = errorInfo;
        this.setState((state) => ({ ...state, hasError: true })); // eslint-disable-line react/no-set-state
      };
    }
  }

  render () {
    if (this.state.hasError) {
      return this.props.renderError({
        error: this._error,
        errorInfo: this._errorInfo
      });
    }

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

  UNSAFE_componentWillMount () {
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
