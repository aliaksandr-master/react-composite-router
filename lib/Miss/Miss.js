/* eslint-env browser */

import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';
import { connect } from 'react-redux';
import MissComponent from './Miss.jsx';



export default compose(
  getContext({
    routerRoutesByName: PropTypes.object.isRequired
  }),
  connect(
    ({ routerState }, { routerRoutesByName }) => ({
      routerState,
      routerRoutesByName
    })
  )
)(MissComponent);
