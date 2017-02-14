/* eslint-env browser, jest */


import { getRoutesByName } from '../route';
import { route } from '../index';


describe('route', () => {
  it('should create some route', () => {
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

    expect(getRoutesByName()).toMatchSnapshot();
  });

  it('should create some route', () => {
    route.create('second', {
      url: '/second'
    });

    expect(getRoutesByName()).toMatchSnapshot();
  });
});
