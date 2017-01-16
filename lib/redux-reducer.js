/* eslint-env browser */

import { compileStateHash, searchStateByLocation } from './routing';





// ACTIONS
const CHANGE_STATE_AND_LOCATION = '@@ROUTER/CHANGE_STATE_AND_LOCATION';
const NOT_FOUND_STATE = '@@ROUTER/STATE_NOT_FOUND';
const THE_SAME_STATE = '@@ROUTER/STATE_IS_THE_SAME';



// ACTION CREATORS
export const changeLocationAction = (location, action) => (dispatch, getState) => {
  const state = searchStateByLocation(location, action);

  if (!state) {
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
      location,
      action
    }
  });
};




// REDUCER
const initialState = {
  name: '',
  hash: null,
  action: '',
  params: {},
  location: {}
};

export default (state = initialState, action) => {
  if (action.type === CHANGE_STATE_AND_LOCATION) {
    return {
      ...state,
      name: action.payload.name,
      hash: compileStateHash(action.payload.name, action.payload.params),
      action: action.payload.action,
      params: action.payload.params,
      location: { ...state.location, ...action.payload.location }
    };
  }

  return state;
};
