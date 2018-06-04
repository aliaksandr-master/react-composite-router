/* eslint-env browser, jest */
import React from 'react';
import testRenderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Link from '../Link';
import RouterContext from '../RouterContext';
import Route from '../Route';
import history from './__mocks__/history';



configure({ adapter: new Adapter() });


describe('Link', () => {
  it('should render something', () => {
    const context = new RouterContext();

    context.setRoutes({
      state: new Route('state', { url: '/' })
    });

    context.setState('state');

    const component = testRenderer.create(
      <WithContext context={{ router: context }}>
        <Link
          className="LinkClass"
          target="_blank"
          state="state"
        >Hello!</Link>
      </WithContext>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should set classes', () => {
    const context = new RouterContext();

    context.setRoutes({
      state: new Route('state', { url: '/state' }),
      'state.some': new Route('state.some', { url: '/some' })
    });

    context.setState('state');

    const component1 = testRenderer.create(
      <WithContext context={{ router: context }}>
        <Link state="state" disabled disabledClass="disabled" activeClass="active" activePathClass="active-path" activeStateClass="active-state">Hello!</Link>
      </WithContext>
    );

    expect(component1.toJSON()).toMatchSnapshot();

    context.setState('state.some');

    const component2 = testRenderer.create(
      <WithContext context={{ router: context }}>
        <Link state="state" disabled disabledClass="disabled" activeClass="active" activePathClass="active-path" activeStateClass="active-state">Hello!</Link>
      </WithContext>
    );

    expect(component2.toJSON()).toMatchSnapshot();
  });

  it('should change location on click', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setHistory(history({ pathname: '/' }));

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
