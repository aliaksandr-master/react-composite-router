/* eslint-env browser */

import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';
import { connect } from 'react-redux';
import SlotComponent from './Slot.jsx';



export default compose(
  getContext({
    routerRoutesByName: PropTypes.object.isRequired
  }),
  connect(
    ({ routerState }, { routerRoutesByName }) => {

      return ({
        routerState,
        routerRoutesByName
      });
    }
  )
)(SlotComponent);
