/* eslint-env browser */

import React, { PropTypes } from 'react';



const View = ({ children }, { routerState }) => children(routerState.params, routerState.name);



View.propTypes = {
  children: PropTypes.func.isRequired
};



View.defaultProps = {
};



View.contextTypes = {
  routerState: PropTypes.object.isRequired
};



export default View;
