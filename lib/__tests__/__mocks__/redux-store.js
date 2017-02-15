

export default (state, reducer = (state) => state) => ({
  dispatch: (action) => {
    state = reducer(state, action);
  },
  subscribe: () => {},
  getState: () => state
});
