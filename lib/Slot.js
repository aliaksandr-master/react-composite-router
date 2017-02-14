/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { assertTrimmedNonEmptyString, assertPlainObject } from './assert';




class Slot extends Component {
  static contextTypes = {
    routerRoutesByName: PropTypes.object.isRequired
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    props: PropTypes.object,
    render: PropTypes.func,
    children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]),
    routerState: PropTypes.shape({ name: PropTypes.string.isRequired, params: PropTypes.object.isRequired })
  };

  render () {
    const { name, children, render, props = {}, routerState } = this.props;
    const { routerRoutesByName } = this.context;

    if (process.env.NODE_ENV !== 'production') {
      assertTrimmedNonEmptyString('Slot name', name);
      assertPlainObject('Slot props', props);
    }

    const routerSlotsComposition = routerRoutesByName.hasOwnProperty(routerState.name) ? routerRoutesByName[routerState.name].slots : {}

    if (routerSlotsComposition.hasOwnProperty(name)) {
      const ViewComponent = routerSlotsComposition[name];

      if (!render) {
        return (<ViewComponent {...props}/>);
      }

      return render(ViewComponent, routerState.params, routerState.name);
    }

    if (!children) {
      return null;
    }

    if (typeof children === 'function') {
      return children(routerState.params, routerState.name);
    }

    return children;
  }
}



export default connect(({ routerState }) => ({ routerState }))(Slot);
