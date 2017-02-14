import { uniq, each, isString, isNumber } from './utils';
import { assertTrimmedNonEmptyString, assertRegExp } from './assert';


const routesByName = {};
let routesNamesInSearchingOrder = [];

// const reroute = (to, from) => ({ name: to.name, prams: to.params });

const createTreeOfRoutes = (name, { url = '', params = {}, slots = {}, reroute = null }, parent = null) => {
  // pre checking
  assertTrimmedNonEmptyString('name', name);
  assertRegExp(/^([a-zA-Z0-9-.]+)$/, 'name', name);

  const sections = name.split('.');

  if (parent) {
    if (!name.startsWith(parent.name)) {
      throw new Error(`child state name (${name}) must starts from parent name "${parent.name}"`);
    }

    if (`${parent.name}.${sections[sections.length - 1]}` !== name) {
      throw new Error(`state "${name}" has invalid count of real parents in name`);
    }
  } else {
    if (sections.length !== 1) {
      throw new Error(`state "${name}" has invalid format`);
    }
  }



  // create route
  const route = {
    url,
    name,
    path: url.replace(/[?#].*$/, ''),
    slots,
    params,
    reroute,
    searchParams: url.replace(/^[^?]*[?]?/, '').split('&').filter(Boolean),
    pathMaskParams: []
  };

  if (parent) {
    route.slots = { ...parent.slots, ...route.slots };
    route.params = { ...parent.params, ...route.params };
    route.searchParams = [ ...parent.searchParams, ...route.searchParams ];
    route.path = `${parent.path.replace(/\/$/, '')}/${route.path.replace(/^\//, '')}`;
    route.url = `${route.path}${route.searchParams.length ? `?${route.searchParams.join('&')}` : ''}`;
  }

  route.pathMaskParams = [];
  route.pathMask = route.path.replace(/:([^/]+)/g, ($0, paramName) => {
    route.pathMaskParams.push(paramName);

    return `{{${paramName}}}`;
  });

  route.pathMaskExpSrc = route.path.replace(/:([^/]+)/g, () => '([^/]+)');

  route.pathMaskExp = new RegExp(`^${route.pathMaskExpSrc}$`);

  route.availableUrlParams = route.searchParams.concat(route.pathMaskParams);
  route.additionalParams = Object.keys(route.params)
  .filter((param) => !route.pathMaskParams.includes(param) && !route.searchParams.includes(param));

  route.availableParams = route.availableUrlParams.concat(route.additionalParams);



  // post checking
  if (route.availableUrlParams.length !== uniq(route.availableUrlParams).length) {
    throw new Error(`route "${route.name}" has duplication in params [${route.searchParams.join(',')}] and [${route.pathMaskParams.join(',')}]`);
  }

  const invalidParams = route.additionalParams.filter((param) => !/^[^a-zA-Z]/.test(param));

  if (invalidParams.length) {
    throw new Error(`route "${route.name}" has invalid params [${invalidParams.join(',')}]. additional params must not starts from [a-zA-Z] symbold`);
  }

  const invalidUrlParams = route.availableUrlParams.filter((param) => /^[^a-zA-Z]/.test(param));

  if (invalidUrlParams.length) {
    throw new Error(`route "${route.name}" has invalid url params [${invalidUrlParams.join(',')}]. url params must starts only from [a-z] symbols`);
  }

  each(route.params, (val, key) => {
    if (!route.availableUrlParams.includes(key)) {
      return;
    }

    if (!isString(val) && !isNumber(val)) {
      throw new Error(`route "${route.name}" has invalid param type of "${key}". must be Number or String`);
    }
  });



  return route;
};



export const routeCreator = (parentRoute) => ({
  create: (name, definition) => {
    const route = createTreeOfRoutes(name, definition, parentRoute);

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
