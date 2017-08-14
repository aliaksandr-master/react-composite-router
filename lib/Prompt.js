import PropTypes from 'prop-types';
import once from 'lodash/once';
import React, { Component } from 'react';
import { router as routerPropTypes } from './propTypes';



const Prompt = class Prompt extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    children: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: routerPropTypes.isRequired
  };

  constructor (...args) {
    super(...args);

    this.state = {
      active: false
    };

    this.deactivate = this.deactivate.bind(this);
  }

  activate () {
    this.setState((state) => ({ ...state, active: true })); // eslint-disable-line react/no-set-state
  }

  deactivate () {
    if (this.hook.session) {
      this.hook.session = null;
    }

    this.setState((state) => ({ ...state, active: false })); // eslint-disable-line react/no-set-state
  }

  attachHook () {
    if (this.hook) {
      return;
    }

    const { router } = this.context;

    this.hook = {
      session: null,
      unsubscribe: router.appendHook((stateName, stateParams) => {
        return new Promise((resolve, reject) => {
          this.hook.session = {
            state: { name: stateName, params: stateParams },
            resolve: once(resolve),
            reject: once(reject)
          };

          this.activate();
        })
          .then((result) => {
            this.deactivate();

            return result;
          })
          .catch((result) => {
            this.deactivate();

            return Promise.reject(result);
          });
      })
    };
  }

  detachHook () {
    if (!this.hook) {
      return;
    }

    if (this.hook.session) {
      this.hook.session.resolve();
      this.hook.session = null;
    }

    this.hook.unsubscribe();

    this.hook = null;
  }

  componentDidMount () {
    if (!this.props.disabled) {
      this.attachHook();
    }
  }

  componentWillUpdate ({ disabled }) {
    if (this.props.disabled !== disabled) {
      if (disabled) {
        this.detachHook();
      } else {
        this.attachHook();
      }
    }
  }

  componentWillUnmount () {
    this.detachHook();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.active || !nextState.active;
  }

  render () {
    if (this.state.active) {
      return this.props.children(this.hook.session) || null;
    }

    return null;
  }
};

export default Prompt;
