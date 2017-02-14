/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Link from '../Link';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import store from './__mocks__/redux-store';

describe('rendering', () => {
  it('should render something', () => {
    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', params: {} } }),
        router: {
          moveTo: () => {},
          onStateChange: () => {},
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
