/* eslint-env browser, jest */
import {
  assertRegExp,
  assertAvailableValues,
  assertPlainObject,
  assertAvailableProps,
  assertTrimmedNonEmptyString
} from '../assert';



describe('assertAvailableValues', () => {
  it('should throws', () => {
    expect(() => {
      assertAvailableValues([], 'some', 1);
    }).toThrow();
  });
  it('should pass', () => {
    expect(() => {
      assertAvailableValues([ 1 ], 'some', 1);
    }).not.toThrow();
  });
});



describe('assertAvailableProps', () => {
  it('should throws', () => {
    expect(() => {
      assertAvailableProps([], 'some', { a: 3 });
    }).toThrow();
  });
  it('should pass', () => {
    expect(() => {
      assertAvailableProps([ 'a' ], 'some', { a: 3 });
    }).not.toThrow();
  });
});



describe('assertPlainObject', () => {
  it('should throws', () => {
    expect(() => {
      assertPlainObject('some', 123);
    }).toThrow();
  });
  it('should pass', () => {
    expect(() => {
      assertPlainObject('some', {});
    }).not.toThrow();
  });
});



describe('assertTrimmedNonEmptyString', () => {
  it('should throws', () => {
    expect(() => {
      assertTrimmedNonEmptyString('some', 123);
    }).toThrow();
    expect(() => {
      assertTrimmedNonEmptyString('some', '');
    }).toThrow();
    expect(() => {
      assertTrimmedNonEmptyString('some', '  ');
    }).toThrow();
  });
  it('should pass', () => {
    expect(() => {
      assertTrimmedNonEmptyString('some', '123');
    }).not.toThrow();
  });
});



describe('assertRegExp', () => {
  it('should throws', () => {
    expect(() => {
      assertRegExp(/hello/, 'some', 123);
    }).toThrow();
    expect(() => {
      assertRegExp(/hello/, 'some', 'hell');
    }).toThrow();
  });
  it('should pass', () => {
    expect(() => {
      assertRegExp(/hello/, 'some', 'hello dolly');
    }).not.toThrow();
  });
});
