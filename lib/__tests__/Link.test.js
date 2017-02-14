/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Link from '../Link';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';

describe('rendering', () => {
  it('should render something', () => {
    const component = renderer.create(
      <WithContext context={{
        store: { dispatch: () => {}, subscribe: () => {}, getState: () => ({ routerState: { name: '', params: {} } }) },
        router: {
          moveTo: () => {},
          getState: () => ({ name: '', params: {} }),
          createHref: () => ({ pathname: '/', search: '', hash: '' }),
          calcLocation: () => ({ name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' })
        }
      }}>
        <Link state="state">Hello!</Link>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
