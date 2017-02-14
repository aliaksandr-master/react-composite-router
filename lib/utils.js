import URIjs from 'urijs';
import uniq from 'lodash/uniq';
import each from 'lodash/each';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import once from 'lodash/once';
import reduce from 'lodash/reduce';
import isPlainObject from 'lodash/isPlainObject';
import { compose } from 'redux';



export {
  once,
  uniq,
  each,
  compose,
  reduce,
  isString,
  isNumber,
  isPlainObject
};


export const parseSearchString = (string) =>
  URIjs.parseQuery(string);



export const calcSearchString = (params) =>
  URIjs.buildQuery(params, true);



export const compileStateHash = (name, params) =>
  `${name}?${calcSearchString(params)}`;
