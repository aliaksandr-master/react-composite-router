import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';
import each from 'lodash/each';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import URIjs from 'urijs';
import { assertTrimmedNonEmptyString, assertRegExp, assertAvailableProps, assertPlainObject } from './assert';



const routesByName = {};
let routesNamesInSearchingOrder = [];


export const getRoutesByName = () => routesByName;

// const filterParams = (stateName, params) => params;
// const reroute = (from, to) => ({ name: to.name, prams: to.params });


const createTreeOfRoutes = (name, { url = '', params = {}, slots = {}, filterParams = null, reroute = null }, parent = null) => {
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
    filterParams,
    slots,
    params,
    reroute,
    searchParams: url.replace(/^[^?]*[?]?/, '').split('&').filter(Boolean),
    pathMaskParams: []
  };

  if (parent) {
    route.filterParams = parent.filterParams && filterParams === null ? parent.filterParams : null;
    route.reroute = parent.reroute && reroute === null ? parent.reroute : null;
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



export const routeCreator = (parentRoute = null) => ({
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



export const route = routeCreator(null);




const parseSearchString = (string) =>
  URIjs.parseQuery(string);




const calcSearchString = (params) =>
  URIjs.buildQuery(params, true);




export const compileStateHash = (name, params) =>
  `${name}?${calcSearchString(params)}`;




export const searchStateByLocation = (location) => {
  const name = routesNamesInSearchingOrder.find((routeName) => {
    const route = routesByName[routeName];

    return route.pathMaskExp.test(location.pathname);
  });

  if (!name) {
    return null;
  }

  const route = routesByName[name];

  let params = { ...route.params };
  const pathname = String(location.pathname || '');

  pathname.replace(route.pathMaskExp, ($0, ...args) => {
    params = route.pathMaskParams.reduce((params, paramName, index) => {
      params[paramName] = args[index];

      return params;
    }, params);

    return $0;
  });

  const search = String(location.search || '').replace(/^\?/, '');
  const searchParams = search ? parseSearchString(search) : {};

  params = reduce(searchParams, (params, paramName, paramValue) => {
    if (route.searchParams.includes(paramName)) {
      params[paramName] = paramValue;
    }

    return params;
  }, params);

  return {
    name,
    params
  };
};



export const moveTo = (history, location, { replace = false, reload = false } = {}) => {
  if (!location) {
    throw new Error('location is empty');
    return;
  }

  if (reload) {
    window.location.href = history.createHref(location);
    return;
  }

  if (replace) {
    history.replace(location);
  } else {
    history.push(location);
  }
};



const calcNewState = (fromState, toRoute, withNewParams) => {
  const route = toRoute;

  let params = route.availableParams.reduce((params, paramName) => {
    if (withNewParams.hasOwnProperty(paramName)) {
      return withNewParams[paramName];
    }

    if (fromState.params.hasOwnProperty(paramName)) {
      return toRoute.params[paramName];
    }

    return params;
  }, { ...route.params });

  if (route.filterParams) {
    params = route.filterParams(toRoute.name, params);
  }

  if (process.env.NODE_ENV !== 'production') {
    assertAvailableProps(route.availableParams, 'route params', params);
  }

  if (route.reroute) {
    const newRoute = route.reroute({ name: route.name, params }, { name: fromState.name, params: fromState.params });

    if (newRoute !== undefined) {
      if (routesByName.hasOwnProperty(newRoute.name)) {
        return {
          route: routesByName[newRoute.name],
          params: newRoute.params || {}
        };
      }

      throw new Error('invalid route after rerouting');
    }
  }

  return {
    route,
    params
  };
};


export const calcLocation = (fromState, toRoute, withNewParams) => {
  const { route, params } = calcNewState(fromState, toRoute, withNewParams);

  const pathname = route.pathMask.replace(/{{([^}]+)}}/g, ($0, paramName) => {
    if (params.hasOwnProperty(paramName)) {
      return params[paramName];
    }

    throw new Error(`Route param "${paramName}" was not defined for route "${route.name}"`);
  });

  const searchParams = route.searchParams.reduce((search, searchParam) => {
    if (params.hasOwnProperty(searchParam) && params[searchParam] !== route.params[searchParam]) {
      search[searchParam] = params[searchParam];
    }

    return search;
  }, {});

  const location = { pathname, hash: '', search: '' };

  if (searchParams) {
    location.search = calcSearchString(searchParams);
  }

  return location;
};
