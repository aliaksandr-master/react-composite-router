/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Router from '../Router';
import route from '../route';
import Slot from '../Slot';
import Redirect from '../Redirect';
import Link from '../Link';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import store from './__mocks__/redux-store';
import history from './__mocks__/history';

describe('rendering', () => {
  it('should render something', () => {
    route.create('state', { url: 'state' });

    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', initialized: true, params: {} } })
      }}>
        <Router history={history()} name="some">
          <div>
            <span>Hello!</span>
            <Link state="state">Some</Link>
            <Redirect state="state"/>
            <Slot name="some" />
          </div>
        </Router>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
