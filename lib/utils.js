import URIjs from 'urijs';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import each from 'lodash/each';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import once from 'lodash/once';
import reduce from 'lodash/reduce';
import isPlainObject from 'lodash/isPlainObject';



export {
  once,
  uniq,
  each,
  isEqual,
  reduce,
  isString,
  isNumber,
  isPlainObject
};


export const parseSearchString = (string) =>
  URIjs.parseQuery(string);



export const calcSearchString = (params) =>
  URIjs.buildQuery(params, true);
