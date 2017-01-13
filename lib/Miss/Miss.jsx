/* eslint-env browser */

import React, { PropTypes } from 'react';



const Miss = (componentProps) => {
  const { children, routerRoutesByName, routerState } = componentProps;

  if (!children || routerRoutesByName.hasOwnProperty(routerState.name)) {
    return null;
  }

  if (typeof children === 'function') {
    return children();
  }

  return children;
};



Miss.propTypes = {
  routerState: PropTypes.object.isRequired,
  routerRoutesByName: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.element ]).isRequired
};



Miss.defaultProps = {};



export default Miss;
