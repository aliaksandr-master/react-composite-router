import { isPlainObject } from './utils';



const getObjectType = (value) => Object.prototype.toString.call(value);
const printValue = (value) => `${getObjectType(value)}: ${JSON.stringify(value)}`;

export const assertRegExp = (exp, name, value) => {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be string`);
  }

  if (!exp.test(value)) {
    throw new Error(`${name} "${value}" has invalid format`);
  }
};

export const assertTrimmedNonEmptyString = (name, value) => {
  if (!value || typeof value !== 'string') {
    throw new TypeError(`${name} must be non empty string, (${printValue(value)}) given`);
  }

  if (value.trim() !== value) {
    throw new Error(`${name} was not trimmed, (${printValue(value)}) given`);
  }
};

export const assertPlainObject = (name, value) => {
  if (!isPlainObject(value)) {
    throw new TypeError(`${name} must be plain object, "${getObjectType(value)}" given`);
  }
};

export const assertAvailableValues = (available, name, value) => {
  if (!available.includes(value)) {
    throw new Error(`${name} has invalid value [${value}]`);
  }
};

export const assertAvailableProps = (availableProps, name, value) => {
  assertPlainObject(name, value);

  Object.keys(value).forEach((val) => {
    assertAvailableValues(availableProps, name, val);
  });
};
