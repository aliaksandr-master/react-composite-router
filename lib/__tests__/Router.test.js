/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Router from '../Router';
import route from '../route';
import Slot from '../Slot';
import Redirect from '../Redirect';
import Link from '../Link';
import renderer from 'react-test-renderer';
import history from './__mocks__/history';
import reducer from '../redux-reducer';

describe('rendering', () => {
  it('should render something', () => {
    route.create('state', { url: '/state' });

    const store = createStore(
      combineReducers({
        routerState: reducer
      }),
      applyMiddleware(thunk)
    );

    const component = renderer.create(
      <Provider store={store}>
        <Router history={history({ pathname: '/state' })} name="some">
          <div>
            <span>Hello!</span>
            <Link state="state">Some</Link>
            <Redirect state="state"/>
            <Slot name="some" />
          </div>
        </Router>
      </Provider>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
