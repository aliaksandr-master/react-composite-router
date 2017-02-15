/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Link from '../Link';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import RouterContext from '../RouterContext';
import Route from '../Route';
import store from './__mocks__/redux-store';
import history from './__mocks__/history';

describe('rendering', () => {
  it('should render something', () => {
    const routerContext = new RouterContext();

    routerContext.setHistory(history());

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setState({ name: 'state' });

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Link
          className="LinkClass"
          target="_blank"
          state="state"
          disabled
          disabledClass="disabled"
          activeClass="active"
          activeStateClass="active-state"
        >Hello!</Link>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
