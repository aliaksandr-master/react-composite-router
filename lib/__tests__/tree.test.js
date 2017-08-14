/* eslint-env browser, jest */
import { routesTree } from '../index';



describe('route', () => {
  it('should create some route', () => {
    const tree = routesTree();

    const someRoute = tree.createRootRoute('some', {
      url: '/some/:id',
      params: {
        id: String(-1),
        _additional: true
      }
    });

    someRoute.createChildRoute('some.child', {
      url: '/child?some&param'
    });

    expect(tree.getRoutes()).toMatchSnapshot();
  });

  it('should create some route', () => {
    const tree = routesTree();

    tree.createRootRoute('second', {
      url: '/second'
    });

    expect(tree.getRoutes()).toMatchSnapshot();
  });
});
