// ACTIONS
const CHANGE_STATE = '@@router/CHANGE_STATE';



// ACTION CREATORS
export const changeStateAction = (name, params) => ({
  type: CHANGE_STATE,
  payload: { name, params }
});



// REDUCER
export default (state = { name: '', params: {} }, action) => {
  if (action.type === CHANGE_STATE) {
    return Object.assign({}, state, {
      name: action.payload.name,
      params: action.payload.params
    });
  }

  return state;
};
