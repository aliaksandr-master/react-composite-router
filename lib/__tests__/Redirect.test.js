/* eslint-env browser, jest */

import React from 'react';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import Redirect from '../Redirect';
import RouterContext from '../RouterContext';
import store from './__mocks__/redux-store';
import history from './__mocks__/history';

describe('rendering', () => {
  it('should render something', () => {
    const routerContext = new RouterContext();

    routerContext.setHistory(history());

    routerContext.setRoutes({
      state: { name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' }
    });

    const component = renderer.create(
      <WithContext
        context={{
          store: store({ routerState: { name: '', params: {} } }),
          router: routerContext
        }}
      >
        <Redirect state="state" />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
