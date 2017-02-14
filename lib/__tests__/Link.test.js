/* eslint-env browser, jest */

import React from 'react';
import Link from '../Link';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import identity from 'lodash/identity';

describe('rendering', () => {
  it('should render something', () => {
    const component = renderer.create(
      <WithContext context={{
        store: { dispatch: () => {}, subscribe: () => {}, getState: () => ({ routerState: { name: '', params: {} } }) },
        routerState: { name: 'state', params: {} },
        history: { createHref: identity, location: {}, listen: () => {} },
        routerRoutesByName: {
          state: { name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' }
        }
      }}>
        <Link state="state">Hello!</Link>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
