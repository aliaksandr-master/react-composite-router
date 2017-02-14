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
  setPropTypes({
    history: historyPropTypes()
  }),
  connect(
    ({ routerState }) => ({
      routerState,
      routerRoutesByName: getRoutesByName()
    }),
    {
      changeLocationAction
    }
  ),
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
      routerRoutesByName: PropTypes.object.isRequired
    },
    ({ history, routerRoutesByName }) => ({
      history,
      routerRoutesByName
    })
  )
)(RouterComponent);



export default Router;
