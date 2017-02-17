/* eslint-env browser, jest */

import RouterContext from '../RouterContext';
import Route from '../Route';
import FakeHistory from '../FakeHistory';
import History from './__mocks__/history';

describe('RouterContext with FakeHistory', () => {
  it('should call onChange', () => {
    const context = new RouterContext();

    context.setRoutes({
      'some.state': new Route('some.state', { url: '/some-state?some', params: { _hello: 3 } }),
      'some.state.other': new Route('some.state.other', { url: '/some-other?some', params: { _hello: 3 } }),
      'some': new Route('some', { url: '/' })
    });

    const history = new FakeHistory();

    history.location.pathname = '/';

    context.setHistory(history);

    const listener = jest.fn();

    const destroy = context.onStateChange(listener);

    history.replace({ pathname: '/some-state' });

    expect(listener).toBeCalled();

    context.destroy();

    destroy();
  });

  it('should call moveTo', () => {
    const context = new RouterContext();

    context.setRoutes({
      'some.state': new Route('some.state', { url: '/some-state?some', params: { _hello: 3 } }),
      'some.state.other': new Route('some.state.other', { url: '/some-other?some', params: { _hello: 3 } }),
      'some': new Route('some', { url: '/' })
    });

    const listener = jest.fn();

    context.onStateChange(listener);

    context.moveTo({ pathname: '/', hash: '', search: '' });
    context.moveTo({ pathname: '/some-other', hash: '', search: '' }, { replace: true });

    expect(listener).toBeCalled();
  });

  it('should calc location with rerouting', () => {
    const context = new RouterContext();

    context.setRoutes({
      'some.state': new Route('some.state', { url: '/some-state?some', params: { _hello: 3 } }),
      'some.state.other': new Route('some.state.other', { url: '/some-other?some', params: { _hello: 3 } }),
      'some': new Route('some', { url: '/', reroute: () => ({ name: 'some.state.other' }) })
    });

    expect(context.calcLocation('some', {})).toMatchSnapshot();

    expect(context.calcLocation('some.state', {})).toMatchSnapshot();

    expect(context.calcLocation('some.state.other', {})).toMatchSnapshot();
  });

  it('should calc location', () => {
    const context = new RouterContext();

    context.setRoutes({
      root: new Route('root', { url: '/' }),
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    context.setState('some-state', { some: 4 });

    const location = context.calcLocation('some-state', { some: 3 });

    const href = context.createHref(location);

    expect(location).toMatchSnapshot();
    expect(context).toMatchSnapshot();
    expect(href).toBe('/some-state?some=3');
  });
});

describe('RouterContext with new history', () => {

  it('', () => {
    const context = new RouterContext();

    context.setRoutes({
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    const result1 = context.searchStateByLocation({ pathname: '', hash: '', search: '' }, 'POP');

    expect(result1).toMatchSnapshot();

    const result2 = context.searchStateByLocation({ pathname: '/some-state', hash: '', search: '' }, 'POP');

    expect(result2).toMatchSnapshot();
  });

  it('should run every listener', () => {
    const context = new RouterContext();

    context.setRoutes({
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    const func1 = jest.fn();
    const func2 = jest.fn();
    const func3 = jest.fn();

    context.onStateChange(func1);
    context.onStateChange(func2);
    const off = jest.fn(context.onStateChange(func3));

    off();

    context.setState('some-state');

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

    context.setRoutes({
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    context.setState('some-state');

    context.destroy();

    context.onStateChange(func3);

    context.setRoutes({
      'some-state': new Route('some-state', { url: '/some-state?some', params: { _hello: 3 } })
    });

    context.setState('some-state');

    expect(func1).not.toBeCalled();
    expect(func2).toBeCalled();
    expect(func3).toBeCalled();
    expect(context).toMatchSnapshot();
  });
});
