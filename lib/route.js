import Route from './Route';


const routesByName = {};
let routesNamesInSearchingOrder = [];


export const routeCreator = (parentRoute) => ({
  create: (name, definition) => {
    const route = parentRoute ? parentRoute.createChildRoute(name, definition) : Route.createRootRoute(name, definition);

    routesByName[name] = route;
    routesNamesInSearchingOrder.push(name);

    routesNamesInSearchingOrder = routesNamesInSearchingOrder.sort((name1, name2) => {
      const segmentsLen1 = name1.split('.').length;
      const segmentsLen2 = name2.split('.').length;

      if (segmentsLen1 > segmentsLen2) {
        return -1;
      }

      return segmentsLen1 < segmentsLen2 ? 1 : 0;
    });

    return routeCreator(route);
  }
});



export const getRoutesByName = () => routesByName;



export const getRoutesSearchSequence = () => routesNamesInSearchingOrder;



export default routeCreator(null);
