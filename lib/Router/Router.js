/* eslint-env browser */

import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withContext, setPropTypes } from 'recompose';
import once from 'lodash/once';
import RouterComponent from './Router.jsx';
import { selectRouterSlotsComposition, changeLocationAction, selectRouterRoutesByName } from '../redux-reducer';
import historyPropTypes from '../util/historyPropTypes';


const Router = compose(
  setPropTypes({
    history: historyPropTypes()
  }),
  connect(
    ({ routerState }) => ({
      routerState
    }),
    {
      changeLocationAction
    }
  ),
  withContext(
    {
      history: historyPropTypes(),
      routerState: PropTypes.object.isRequired,
      routerSlotsComposition: PropTypes.objectOf(PropTypes.func.isRequired),
      routerRoutesByName: PropTypes.object.isRequired
    },
    ({ routerState, history }) => ({
      history,
      routerState,
      routerRoutesByName: selectRouterRoutesByName(),
      routerSlotsComposition: selectRouterSlotsComposition({ routerState })
    })
  ),
  lifecycle({
    componentWillMount () {
      const { changeLocationAction, history } = this.props;

      this._historyCleanupListener = once(history.listen((location, action) => {
        changeLocationAction(location, action);
      }));
    },

    componentWillUnmount () {
      this._historyCleanupListener();
    },

    componentDidMount () {
      const { history, changeLocationAction } = this.props;

      changeLocationAction(history.location, history.action);
    }
  })
)(RouterComponent);



export default Router;
