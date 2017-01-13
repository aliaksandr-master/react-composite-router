/* eslint-env browser */

import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withContext, setPropTypes } from 'recompose';
import once from 'lodash/once';
import RouterComponent from './Router.jsx';
import { getRoutesByName } from '../routing';
import { changeLocationAction } from '../redux-reducer';
import historyPropTypes from '../historyPropTypes';


const Router = compose(
  connect(
    ({ routerState }) => ({
      routerState,
      routerRoutesByName: getRoutesByName()
    }),
    {
      changeLocationAction
    }
  ),
  setPropTypes({
    history: historyPropTypes()
  }),
  lifecycle({
    componentWillMount () {
      const { changeLocationAction, history } = this.props;

      changeLocationAction(history.location, history.action);

      this._historyCleanupListener = once(history.listen((location, action) => {
        changeLocationAction(location, action);
      }));
    },

    componentWillUnmount () {
      this._historyCleanupListener();
    }
  }),
  withContext(
    {
      history: historyPropTypes(),
      routerState: PropTypes.object.isRequired,
      routerRoutesByName: PropTypes.object.isRequired
    },
    ({ routerState, history, routerRoutesByName }) => ({
      history,
      routerState,
      routerRoutesByName
    })
  )
)(RouterComponent);



export default Router;
