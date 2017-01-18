/* eslint-env browser */

import React, { PropTypes } from 'react';



const Router = ({ children, routerState }) =>
  routerState.initialized ? children : <noscript />;



Router.propTypes = {
  routerState: PropTypes.object,
  children: PropTypes.node
};



Router.defaultProps = {
};



export default Router;
