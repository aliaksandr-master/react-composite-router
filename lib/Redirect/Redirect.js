/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, setPropTypes } from 'recompose';
import { changeStateAction } from '../redux-reducer';


const EmptyComponent = class EmptyComponent extends Component {
  render () {
    return null;
  }
};


export default compose(
  setPropTypes({
    state: PropTypes.string.isRequired,
    params: PropTypes.object
  }),
  connect(null, {
    changeStateAction
  }),
  lifecycle({
    componentWillMount () {
      const { params, state, changeStateAction } = this.props;

      changeStateAction(params, state);
    }
  })
)(EmptyComponent);
