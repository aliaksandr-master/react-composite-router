/* eslint-env browser */

import React, { PropTypes } from 'react';
import isFunction from 'lodash/isFunction';
import { assertTrimmedNonEmptyString, assertPlainObject } from '../util/assert';



const Slot = (componentProps, context) => {
  const { name, children, render, props = {}, routerRoutesByName, routerState } = componentProps;

  if (process.env.NODE_ENV !== 'production') {
    assertTrimmedNonEmptyString('Slot name', name);
    assertPlainObject('Slot props', props);
  }

  const routerSlotsComposition = routerRoutesByName.hasOwnProperty(routerState.name) ? routerRoutesByName[routerState.name].slots : {}

  if (routerSlotsComposition.hasOwnProperty(name)) {
    const ViewComponent = routerSlotsComposition[name];

    if (!render) {
      return (<div><ViewComponent/><span>{Object.keys(routerSlotsComposition).join(',')}</span></div>);
    }

    return render(ViewComponent, routerState.params, routerState.name);
  }

  if (!children) {
    return null;
  }

  if (isFunction(children)) {
    return children(routerState.params, routerState.name);
  }

  return children;
};



Slot.propTypes = {
  name: PropTypes.string.isRequired,
  props: PropTypes.object,
  render: PropTypes.func,
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.element ]),
  routerState: PropTypes.shape({ name: PropTypes.string.isRequired, params: PropTypes.object.isRequired })
};



Slot.defaultProps = {
};



export default Slot;
