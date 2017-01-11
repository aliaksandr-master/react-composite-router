import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';
import { connect } from 'react-redux';
import LinkComponent from './Link.jsx';
import historyPropTypes from '../util/historyPropTypes';




export default compose(
  getContext({
    history: historyPropTypes(),
    routerRoutesByName: PropTypes.object.isRequired
  }),
  connect(({ routerState }, { history, routerRoutesByName }) => ({
    history,
    routerState,
    routerRoutesByName
  }), {})
)(LinkComponent);
