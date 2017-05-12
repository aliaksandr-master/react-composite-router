import { assertTrimmedNonEmptyString, assertRegExp } from './assert';
import { uniq, each, reduce, isString, isNumber, calcSearchString, parseSearchString } from './utils';


const calcUrlProps = (url) => ({
  path: url.replace(/[?#].*$/, ''),
  searchParams: url.replace(/^[^?]*[?]?/, '').split('&').filter(Boolean)
});


export default class Route {
  constructor (name, { url = '', params = {}, slots = {}, reroute = null } = {}) {
    assertTrimmedNonEmptyString('name', name);
    assertRegExp(/^([a-zA-Z0-9-.]+)$/, 'name', name);

    const parsedUrl = calcUrlProps(url);

    this.url = url;
    this.name = name;
    this.path = parsedUrl.path;
    this.slots = slots;
    this.params = params;
    this.reroute = reroute; // function for replace routes
    this.searchParams = parsedUrl.searchParams;
    this.pathMaskParams = [];

    this.pathMask = this.path.replace(/:([^/]+)/g, ($0, paramName) => {
      this.pathMaskParams.push(paramName);

      return `{{${paramName}}}`;
    });

    this.pathMaskExpSrc = this.path.replace(/:([^/]+)/g, () => '([^/]+)');

    this.pathMaskExp = new RegExp(`^${this.pathMaskExpSrc}$`);

    this.availableUrlParams = this.searchParams.concat(this.pathMaskParams);
    this.additionalParams = Object.keys(this.params)
      .filter((param) => !this.pathMaskParams.includes(param) && !this.searchParams.includes(param));

    this.availableParams = this.availableUrlParams.concat(this.additionalParams);




    // post checking
    if (this.availableUrlParams.length !== uniq(this.availableUrlParams).length) {
      throw new Error(`this "${this.name}" has duplication in params [${this.searchParams.join(',')}] and [${this.pathMaskParams.join(',')}]`);
    }

    const invalidParams = this.additionalParams.filter((param) => !/^[^a-zA-Z]/.test(param));

    if (invalidParams.length) {
      throw new Error(`this "${this.name}" has invalid params [${invalidParams.join(',')}]. additional params must not starts from [a-zA-Z] symbold`);
    }

    const invalidUrlParams = this.availableUrlParams.filter((param) => /^[^a-zA-Z]/.test(param));

    if (invalidUrlParams.length) {
      throw new Error(`this "${this.name}" has invalid url params [${invalidUrlParams.join(',')}]. url params must starts only from [a-z] symbols`);
    }

    each(this.params, (val, key) => {
      if (!this.availableUrlParams.includes(key)) {
        return;
      }

      if (!isString(val) && !isNumber(val)) {
        throw new Error(`this "${this.name}" has invalid param type of "${key}". must be Number or String`);
      }
    });
  }

  isMatch (location, action) {
    return this.pathMaskExp.test(location.pathname || '');
  }

  parseLocationParams (location) { // location
    const { pathname, search, hash } = location;
    let params = Object.assign({}, this.params);

    String(pathname || '').replace(this.pathMaskExp, ($0, ...args) => {
      params = this.pathMaskParams.reduce((params, paramName, index) => {
        params[paramName] = args[index];

        return params;
      }, params);

      return $0;
    });

    const searchParams = search ? parseSearchString(String(search || '').replace(/^\?/, '')) : {};

    params = reduce(searchParams, (params, paramValue, paramName) => {
      if (this.searchParams.includes(paramName)) {
        params[paramName] = paramValue;
      }

      return params;
    }, params);

    return params;
  }

  calcLocation (params) {
    const pathname = this.pathMask.replace(/{{([^}]+)}}/g, ($0, paramName) => {
      if (params.hasOwnProperty(paramName)) {
        return params[paramName];
      }

      throw new Error(`Route param "${paramName}" was not defined for route "${this.name}"`);
    });

    const searchParams = this.searchParams.reduce((search, searchParam) => {
      if (params.hasOwnProperty(searchParam) && params[searchParam] !== this.params[searchParam]) {
        search[searchParam] = params[searchParam];
      }

      return search;
    }, {});

    const location = { pathname, hash: '', search: '' };

    if (searchParams) {
      location.search = calcSearchString(searchParams);
    }

    return location;
  }

  calcParams (stateParams, currentStateParams = {}, resetParams = false) {
    return this.availableParams.reduce((params, paramName) => {
      if (stateParams.hasOwnProperty(paramName)) {
        params[paramName] = stateParams[paramName];
      } else if (!resetParams && currentStateParams.hasOwnProperty(paramName)) {
        params[paramName] = currentStateParams[paramName];
      }

      return params;
    }, Object.assign({}, this.params));
  }

  static createRootRoute (name, definition) {
    const sections = String(name).split('.');

    if (sections.length !== 1) {
      throw new Error(`state "${name}" has invalid format`);
    }

    return new Route(name, definition);
  }

  createChildRoute (name, { url = '', params = {}, slots = {}, reroute = null } = {}) {
    const sections = String(name).split('.');

    if (`${this.name}.${sections[sections.length - 1]}` !== name) {
      throw new Error(`child state name (${name}) must starts from parent name "${this.name}"`);
    }

    const { searchParams, path } = calcUrlProps(url);

    slots = Object.assign({}, this.slots, slots);
    params = Object.assign({}, this.params, params);

    const urlPath = `${this.path.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const urlSearch = `${[ ...this.searchParams, ...searchParams ].join('&')}`;

    url = `${urlPath}${urlSearch ? `?${urlSearch}` : ''}`;

    return new Route(name, { slots, params, url, reroute });
  }
}
