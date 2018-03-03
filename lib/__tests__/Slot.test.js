/* eslint-env browser, jest */
/* eslint-disable react/jsx-no-bind, react/display-name */
import React from 'react';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import RouterContext from '../RouterContext';
import Slot from '../Slot';
import Route from '../Route';
import history from './__mocks__/history';



describe('rendering', () => {
  it('should render something', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setHistory(history({ pathname: '/' }));

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Slot name="some">{() => (<span>Hello!</span>)}</Slot>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render fallback function', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/' })
    });

    routerContext.setHistory(history({ pathname: '/' }));

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Slot name="some">{() => (<span>Hello!</span>)}</Slot>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render function', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/', slots: { some: () => <span>Hello</span> } })
    });

    routerContext.setHistory(history({ pathname: '/' }));

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Slot name="some" render={() => (<span>Hello!</span>)} />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render slot', () => {
    const routerContext = new RouterContext();

    routerContext.setRoutes({
      state: new Route('state', { url: '/', slots: { some: () => <span>Hello</span> } })
    });

    routerContext.setHistory(history({ pathname: '/' }));

    const component = renderer.create(
      <WithContext context={{ router: routerContext }}>
        <Slot name="some" />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
