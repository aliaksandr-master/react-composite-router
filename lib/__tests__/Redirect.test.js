/* eslint-env browser, jest */
/* eslint-disable react/display-name */

import React from 'react';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import Redirect from '../Redirect';
import RouterContext from '../RouterContext';
import Route from '../Route';
import history from './__mocks__/history';

describe('rendering', () => {
  it('should render something', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/', slots: { some: () => <span>Hello</span> } })
    });

    routerContext.setHistory(history({ pathname: '/' }));

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Redirect state="state" />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
