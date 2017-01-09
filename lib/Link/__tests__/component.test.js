/* eslint-env browser, jest */

jest.mock('../../Router', () => ({
  calcLocation: (state, params) => ({
    pathname: state,
    hash: '',
    search: ''
  })
}));

import React from 'react';
import Link from '../Link.jsx';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import identity from 'lodash/identity';

describe('rendering', () => {
  it('should render something', () => {
    const component = renderer.create(
      <WithContext context={{
        routerState: { name: 'state', params: {} },
        history: { createHref: identity, location: {} },
        routerRoutesByName: {
          state: { name: 'state' }
        }
      }}>
        <Link to="state">Hello!</Link>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
