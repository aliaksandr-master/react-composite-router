/* eslint-env browser */

import React, { PropTypes } from 'react';



const Router = ({ children }) => children;



Router.propTypes = {
  children: PropTypes.element.isRequired
};



Router.defaultProps = {
};



export default Router;
