/* eslint-env browser */

import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';
import { connect } from 'react-redux';
import SlotComponent from './Slot.jsx';



export default compose(
  getContext({
    routerSlotsComposition: PropTypes.objectOf(PropTypes.func.isRequired)
  }),
  connect(
    ({ routerState }, { routerSlotsComposition }) => {
      console.log(1111, routerState.name, Object.keys(routerSlotsComposition));

      return ({
        routerState,
        routerSlotsComposition
      });
    }
  )
)(SlotComponent);
