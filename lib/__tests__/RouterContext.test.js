/* eslint-env browser, jest */

import RouterContext from '../RouterContext';
import Route from '../Route';
import History from './__mocks__/history';

describe('RouterContext', () => {

  it('should run every listener', () => {
    const context = new RouterContext();

    const func1 = jest.fn();
    const func2 = jest.fn();
    const func3 = jest.fn();

    context.onStateChange(func1);
    context.onStateChange(func2);
    const off = jest.fn(context.onStateChange(func3));

    off();

    context.setState({ name: '', params: {} });

    expect(func1).toBeCalled();
    expect(func2).toBeCalled();
    expect(func3).not.toBeCalled();
    expect(off).toBeCalled();
    expect(context).toMatchSnapshot();
  });

  it('should calc location', () => {
    const context = new RouterContext();

    context.setHistory(History());

    context.setState({
      name: 'some',
      params: {
        some: 4
      }
    });

    context.setRoutes({
      state: new Route('state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    const location = context.calcLocation('state', { some: 3 });

    const href = context.createHref(location);

    expect(location).toMatchSnapshot();
    expect(context).toMatchSnapshot();
    expect(href).toBe('/some-state?some=3');
  });

  it('should destroy', () => {
    const context = new RouterContext();

    const func1 = jest.fn();
    const func2 = jest.fn();
    const func3 = jest.fn();

    context.onStateChange(func1);
    context.onStateChange(func2);

    context.destroy();

    context.setState({ name: '', params: {} });

    context.onStateChange(func3);

    context.setState({ name: 'some', params: {} });

    expect(func1).not.toBeCalled();
    expect(func2).not.toBeCalled();
    expect(func3).toBeCalled();
    expect(context).toMatchSnapshot();
  });
});
