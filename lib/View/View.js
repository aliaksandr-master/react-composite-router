/* eslint-env browser */

import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';
import { connect } from 'react-redux';
import ViewComponent from './View.jsx';



export default compose(
  connect(
    ({ routerState }) => ({
      routerState
    })
  )
)(ViewComponent);
