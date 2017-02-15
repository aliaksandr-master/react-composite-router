/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Link from '../Link';
import testRenderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import { mount } from 'enzyme';
import RouterContext from '../RouterContext';
import Route from '../Route';
import history from './__mocks__/history';

describe('Link', () => {
  it('should render something', () => {
    const routerContext = new RouterContext();

    routerContext.setHistory(history());

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setState('state');

    const component = testRenderer.create(
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

  it('should change location on click', () => {
    const routerContext = new RouterContext();

    routerContext.setHistory(history());

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setState('state');

    const onClick = jest.fn();

    const link = mount(<div>
      <WithContext context={{ router: routerContext }}>
        <Link state="state" onClick={onClick}>Hello!</Link>
      </WithContext>
    </div>);

    link.find('a').simulate('click', { button: 0 });

    expect(onClick).toBeCalled();
  });
});
