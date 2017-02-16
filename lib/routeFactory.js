import Route from './Route';



export const routeCreator = (routesByName, parentRoute) => ({
  create: (name, definition) => {
    const route = parentRoute ? parentRoute.createChildRoute(name, definition) : Route.createRootRoute(name, definition);

    routesByName[name] = route;

    return routeCreator(routesByName, route);
  }
});



export default () => {
  const routes = {}; // mutable

  return Object.assign({ getRoutes: () => routes }, routeCreator(routes, null));
};
