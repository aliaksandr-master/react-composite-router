/* eslint-env browser, jest */


import { routeFactory } from '../index';


describe('route', () => {
  it('should create some route', () => {
    const route = routeFactory();

    const someRoute = route.create('some', {
      url: '/some/:id',
      params: {
        id: String(-1),
        _additional: true
      }
    });

    someRoute.create('some.child', {
      url: '/child?some&param'
    });

    expect(route.getRoutes()).toMatchSnapshot();
  });

  it('should create some route', () => {
    const route = routeFactory();

    route.create('second', {
      url: '/second'
    });

    expect(route.getRoutes()).toMatchSnapshot();
  });
});
