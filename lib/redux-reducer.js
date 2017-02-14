/* eslint-env browser */

import { getRoutesByName, getRoutesSearchSequence } from './route';
import { reduce, compileStateHash, parseSearchString } from './utils';




export const searchStateByLocation = (location) => {
  const routesByName = getRoutesByName();
  const name = getRoutesSearchSequence().find((routeName) => {
    const route = routesByName[routeName];

    return route.pathMaskExp.test(location.pathname || '');
  });

  if (!name) {
    return null;
  }

  const route = routesByName[name];

  return {
    name,
    params: route.parseLocationParams(location)
  };
};




// ACTIONS
const CHANGE_STATE_AND_LOCATION = '@@ROUTER/CHANGE_STATE_AND_LOCATION';
const NOT_FOUND_STATE = '@@ROUTER/STATE_NOT_FOUND';
const THE_SAME_STATE = '@@ROUTER/STATE_IS_THE_SAME';



// ACTION CREATORS
export const changeLocationAction = (location, action) => (dispatch, getState) => {
  const state = searchStateByLocation(location);

  if (!state) {
    window.console && console.error && console.error(`state is not defined for location ${JSON.stringify(location)}`); // eslint-disable-line no-console
    return dispatch({
      type: NOT_FOUND_STATE,
      payload: {}
    });
  }

  const { routerState: { hash } } = getState();
  const params = state.params;
  const name = state.name;

  if (compileStateHash(name, params) === hash) {
    return dispatch({
      type: THE_SAME_STATE,
      payload: {}
    });
  }

  return dispatch({
    type: CHANGE_STATE_AND_LOCATION,
    payload: {
      name,
      params,
      action
    }
  });
};




// REDUCER
const initialState = {
  initialized: false,
  name: '',
  hash: null,
  action: '',
  params: {}
};

export default (state = initialState, action) => {
  if (action.type === NOT_FOUND_STATE) {
    return {
      ...state,
      initialized: true
    };
  }

  if (action.type === CHANGE_STATE_AND_LOCATION) {
    return {
      ...state,
      initialized: true,
      name: action.payload.name,
      hash: compileStateHash(action.payload.name, action.payload.params),
      action: action.payload.action,
      params: action.payload.params
    };
  }

  return state;
};
