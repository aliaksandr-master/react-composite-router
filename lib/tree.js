import Route from './Route';



const routeCreator = (routesByName, parentRoute) => ({
  createChildRoute: (name, definition) => {
    const route = parentRoute ? parentRoute.createChildRoute(name, definition) : Route.createRootRoute(name, definition);

    routesByName[name] = route;

    return routeCreator(routesByName, route);
  }
});



export default () => {
  const routes = {}; // mutable

  return {
    getRoutes: () => routes,
    createRootRoute: routeCreator(routes, null).createChildRoute
  };
};
