/* eslint-env browser */

import { assertTrimmedNonEmptyString, assertAvailableValues, assertPlainObject } from './util/assert';
import { createSelector } from 'reselect';
import { INITIAL_STATE_NAME, getRoutesNamesInSearchingOrder, getRoutesByName, compileStateHash } from './routing';





// ACTIONS
const CHANGE_STATE = '@@ROUTER/CHANGE_STATE';
const CHANGE_STATE_AND_LOCATION = '@@ROUTER/CHANGE_STATE_AND_LOCATION';
const NOT_FOUND_STATE = '@@ROUTER/STATE_NOT_FOUND';
const THE_SAME_STATE = '@@ROUTER/STATE_IS_THE_SAME';



// ACTION CREATORS
export const changeStateAction = (name, params, options = {}) => (dispatch, getState) => {
  if (process.env.NODE_ENV !== 'production') {
    assertTrimmedNonEmptyString('state name', name);
    assertAvailableValues(getRoutesNamesInSearchingOrder(), 'state name', name);
    assertPlainObject('options', options);
  }

  const { routerState: { hash } } = getState();

  if (compileStateHash(name, params) === hash) {
    return dispatch({
      type: THE_SAME_STATE,
      payload: {}
    });
  }

  // TODO: set browser history on change state

  return dispatch({
    type: CHANGE_STATE,
    payload: {
      name,
      params
    }
  });
};

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



// SELECTORS
const getStateName = ({ routerState: { name } }) => name;

export const selectRouterSlotsComposition = createSelector([ getStateName ], (stateName) => {
  if (!getRoutesByName().hasOwnProperty(stateName)) {
    if (!stateName) {
      return {};
    }

    throw new ReferenceError(`invalid state name ${stateName}`);
  }

  return getRoutesByName()[stateName].slots;
});



// REDUCER
const initialState = {
  name: INITIAL_STATE_NAME,
  hash: null,
  action: '',
  params: {},
  location: {}
};

export default (state = initialState, action) => {
  if (action.type === CHANGE_STATE) {
    return {
      ...state,
      name: action.payload.name,
      hash: compileStateHash(action.payload.name, action.payload.params),
      params: action.payload.params
    };
  }

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
