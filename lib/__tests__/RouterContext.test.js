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

    context.setState('some!');

    expect(func1).toBeCalled();
    expect(func2).toBeCalled();
    expect(func3).not.toBeCalled();
    expect(off).toBeCalled();
    expect(context).toMatchSnapshot();
  });

  it('should calc location', () => {
    const context = new RouterContext();

    context.setRoutes({
      root: new Route('root', { url: '/' }),
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    context.setHistory(History({ pathname: '/' }));

    context.setState('some-state', { some: 4 });

    const location = context.calcLocation('some-state', { some: 3 });

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

    context.destroy();

    context.onStateChange(func2);

    context.setState('some1');

    context.destroy();

    context.onStateChange(func3);

    context.setState('some2');

    expect(func1).not.toBeCalled();
    expect(func2).toBeCalled();
    expect(func3).toBeCalled();
    expect(context).toMatchSnapshot();
  });
});
