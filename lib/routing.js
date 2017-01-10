import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';
import { throwHiddenError } from './util/log';
import URIjs from 'urijs';
import { assertTrimmedNonEmptyString, assertRegExp } from './util/assert';



const routesByName = {};
let routesNamesInSearchingOrder = [];


export const INITIAL_STATE_NAME = '';



export const getRoutesByName = () => routesByName;



export const getRoutesNamesInSearchingOrder = () => routesNamesInSearchingOrder;



const registerTreeOfRoutes = (name, { url = '', params = {}, slots = {} }, parent = null) => {
  if (process.env.NODE_ENV !== 'production') {
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
  }

  const route = {
    url,
    name,
    path: url.replace(/\?.*$/, ''),
    slots,
    params,
    parent,
    pathMask: '',
    pathMaskExp: /.+/,
    searchParams: url.replace(/^[?]*\?/, '').split('&'),
    pathMaskParams: []
  };

  if (parent) {
    route.params = { ...parent.params, ...route.params };
    route.slots = { ...parent.slots, ...route.slots };
    route.searchParams = [ ...parent.searchParams, ...route.searchParams ];
    route.path = `${parent.path.replace(/\/$/, '')}/${route.path.replace(/^\//, '')}`;
    route.url = `${route.path}?${route.searchParams.join('&')}`;
  }

  route.pathMaskParams = [];
  route.pathMask = route.path.replace(/:([^/]+)/g, ($0, paramName) => {
    route.pathMaskParams.push(paramName);

    return `{{${paramName}}}`;
  });

  route.pathMaskExpSrc = route.path.replace(/:([^/]+)/g, () => '([^/]+)');

  route.pathMaskExp = new RegExp(`^${route.pathMaskExpSrc}$`);

  route.availableUrlParams = route.searchParams.concat(route.pathMaskParams);
  route.availableParams = uniq(Object.keys(route.params).concat(route.availableParams));

  routesByName[name] = route;
  routesNamesInSearchingOrder.push(name);

  routesNamesInSearchingOrder = routesNamesInSearchingOrder.sort((name1, name2) => {
    const name1segmentsLength = name1.split('.').length;
    const name2segmentsLength = name2.split('.').length;

    if (name1segmentsLength > name2segmentsLength) {
      return -1;
    }

    if (name1segmentsLength < name2segmentsLength) {
      return 1;
    }

    return 0;
  });



  // post checking
  if (route.availableUrlParams.length !== uniq(route.availableUrlParams).length) {
    throw new Error(`route "${route.name}" has duplicate keys with search and path params`);
  }

  const invalidParams = Object.keys(route.params)
    .filter((param) => !route.pathMaskParams.includes(param) && !route.searchParams.includes(param))
    .filter((param) => !/^[^a-zA-Z]/.test(param));

  if (invalidParams.length) {
    throw new Error(`route "${route.name}" has invalid params [${invalidParams.join(',')}]. additional params must not starts from [a-zA-Z] symbold`);
  }

  const invalidUrlParams = route.availableUrlParams.filter((param) => /^[^a-zA-Z]/.test(param));

  if (invalidUrlParams.length) {
    throw new Error(`route "${route.name}" has invalid url params [${invalidUrlParams.join(',')}]. url params must starts only from [a-z] symbols`);
  }



  return {
    create: (...args) =>
      registerTreeOfRoutes(...args, route)
  };
};



export const createRoute = (name, definition) =>
  registerTreeOfRoutes(name, definition, null);




export const parseSearchString = (string) =>
  URIjs.parseQuery(string);




export const calcSearchString = (params) =>
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




export const calcLocation = (route, params) => {
  const pathname = route.pathMask.replace(/{{([^}]+)}}/g, ($0, $1) => {
    if (params.hasOwnProperty($1)) {
      return params[$1];
    }

    throwHiddenError(`Route param "${$1}" is not defined for route "${route.name}"`);

    return '-ERROR-';
  });

  const searchParams = route.searchParams.reduce((search, searchParam) => {
    if (params.hasOwnProperty(searchParam)) {
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
