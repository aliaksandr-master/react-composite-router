/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Router from '../Router';
import { routeFactory } from '../index';
import Slot from '../Slot';
import Redirect from '../Redirect';
import Link from '../Link';
import renderer from 'react-test-renderer';
import history from './__mocks__/history';

describe('rendering', () => {
  it('should render something', () => {
    const route = routeFactory();

    route.create('state', { url: '/state' });

    const component = renderer.create(
      <Router history={history({ pathname: '/state' })} routes={route.getRoutes()}>
        <div>
          <span>Hello!</span>
          <Link state="state">Some</Link>
          <Redirect state="state"/>
          <Slot name="some" />
        </div>
      </Router>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
