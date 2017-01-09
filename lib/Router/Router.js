/* eslint-env browser */

import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withContext } from 'recompose';
import once from 'lodash/once';
import RouterComponent from './Router.jsx';
import { selectRouterSlotsComposition, changeLocationAction, selectRouterRoutesByName } from '../redux-reducer';



const Router = compose(
  connect(
    ({ routerState }) => ({
      routerState,
      routerRoutesByName: selectRouterRoutesByName(),
      routerSlotsComposition: selectRouterSlotsComposition({ routerState })
    }),
    {
      changeLocationAction
    }
  ),
  withContext(
    {
      history: PropTypes.object.isRequired,
      routerState: PropTypes.object.isRequired,
      routerSlotsComposition: PropTypes.objectOf(PropTypes.func.isRequired),
      routerRoutesByName: PropTypes.object.isRequired
    },
    ({ routerSlotsComposition, routerState, routerRoutesByName, history }) => ({
      routerSlotsComposition, routerState, routerRoutesByName, history
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