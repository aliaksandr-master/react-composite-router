/* eslint-env browser */

import React, { PropTypes } from 'react';
import isFunction from 'lodash/isFunction';



const Miss = (componentProps) => {
  const { children, routerRoutesByName, routerState } = componentProps;

  if (!children || routerRoutesByName.hasOwnProperty(routerState.name)) {
    return null;
  }

  if (isFunction(children)) {
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
