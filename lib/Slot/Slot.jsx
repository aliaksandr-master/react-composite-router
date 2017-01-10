/* eslint-env browser */

import React, { PropTypes } from 'react';
import isFunction from 'lodash/isFunction';
import { assertTrimmedNonEmptyString, assertPlainObject } from '../util/assert';



const Slot = (componentProps, context) => {
  const { name, children, render, props = {} } = componentProps;
  const { routerSlotsComposition, routerState } = context;

  if (process.env.NODE_ENV !== 'production') {
    assertTrimmedNonEmptyString('Slot name', name);
    assertPlainObject('Slot props', props);
  }

  if (routerSlotsComposition.hasOwnProperty(name)) {
    const ViewComponent = routerSlotsComposition[name];

    if (!render) {
      return (<ViewComponent {...props} />);
    }

    return render(ViewComponent, routerState.params, routerState.name);
  }

  if (!children) {
    return null;
  }

  if (isFunction(children)) {
    return children(props, routerState.params, routerState.name);
  }

  return children;
};



Slot.propTypes = {
  name: PropTypes.string.isRequired,
  props: PropTypes.object,
  render: PropTypes.func,
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.element ])
};



Slot.defaultProps = {
};



Slot.contextTypes = {
  routerSlotsComposition: PropTypes.objectOf(PropTypes.func.isRequired),
  routerState: PropTypes.object.isRequired
};



export default Slot;
