/* eslint-env browser */

//import { isEqual } from './utils';





// ACTIONS
const CHANGE_STATE = '@@router/CHANGE_STATE';
const THE_SAME_STATE = '@@router/THE_SAME_STATE';



// ACTION CREATORS
export const changeStateAction = (name, params) => ({
  type: CHANGE_STATE,
  payload: { name, params }
});

//{
//  //if (!newState) {
//  //  window.console && console.error && console.error(`state is not defined for location ${JSON.stringify(location)}`); // eslint-disable-line no-console, no-unused-expressions
//  //  return dispatch({
//  //    type: NOT_FOUND_STATE,
//  //    payload: {}
//  //  });
//  //}
//
//  const { routerState } = getState();
//
//  //if (routerState.name === newState.name && isEqual(newState.params, routerState.params)) {
//  //  return dispatch({
//  //    type: THE_SAME_STATE,
//  //    payload: {}
//  //  });
//  //}
//
//  return dispatch;
//};




// REDUCER
export default (state = { name: '', params: {} }, action) => {
  if (action.type === CHANGE_STATE) {
    return {
      ...state,
      name: action.payload.name,
      params: action.payload.params
    };
  }

  return state;
};
