/* eslint-env browser, jest */

import reducer, { changeStateAction } from '../reducer';

describe('redux reducer', () => {
  it('should set default values', () => {
    const state = reducer(undefined, { type: 'some' });

    expect(state).toMatchSnapshot();
  });

  it('should update state', () => {
    const state = reducer(undefined, changeStateAction('some', { param: 123 }));

    expect(state).toMatchSnapshot();
  });
});
