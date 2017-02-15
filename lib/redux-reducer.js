/* eslint-env browser */

import { getRoutesByName, getRoutesSearchSequence } from './route';
import { isEqual } from './utils';




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
const CHANGE_STATE = '@@router/CHANGE_STATE';
const NOT_FOUND_STATE = '@@router/STATE_NOT_FOUND';
const THE_SAME_STATE = '@@router/THE_SAME_STATE';



// ACTION CREATORS
export const changeStateAction = (location, action) => (dispatch, getState) => {
  const newState = searchStateByLocation(location);

  if (!newState) {
    window.console && console.error && console.error(`state is not defined for location ${JSON.stringify(location)}`); // eslint-disable-line no-console, no-unused-expressions
    return dispatch({
      type: NOT_FOUND_STATE,
      payload: {}
    });
  }

  const { routerState } = getState();

  if (routerState.name === newState.name && isEqual(newState.params, routerState.params)) {
    return dispatch({
      type: THE_SAME_STATE,
      payload: {}
    });
  }

  return dispatch({
    type: CHANGE_STATE,
    payload: newState
  });
};




// REDUCER
const initialState = {
  name: '',
  params: {}
};

export default (state = initialState, action) => {
  if (action.type === CHANGE_STATE) {
    return {
      ...state,
      name: action.payload.name,
      params: action.payload.params
    };
  }

  return state;
};
