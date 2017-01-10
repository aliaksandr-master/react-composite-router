/* eslint-env browser */

import React, { PropTypes } from 'react';



const View = ({ children, routerState }) =>
  children(routerState.params, routerState.name);



View.propTypes = {
  children: PropTypes.func.isRequired,
  routerState: PropTypes.object.isRequired
};



View.defaultProps = {
};



export default View;
