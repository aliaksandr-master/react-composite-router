/* eslint-env browser, jest */
import React from 'react';
import renderer from 'react-test-renderer';
import Router from '../Router';
import { routesTree } from '../index';
import Slot from '../Slot';
import Redirect from '../Redirect';
import Link from '../Link';
import history from './__mocks__/history';



describe('rendering', () => {
  it('should render something', () => {
    const tree = routesTree();

    tree.createRootRoute('state', { url: '/state' });

    const component = renderer.create(
      <Router history={history({ pathname: '/state' })} routes={tree}>
        <div>
          <span>Hello!</span>
          <Link state="state">Some</Link>
          <Redirect state="state" />
          <Slot name="some" />
        </div>
      </Router>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
