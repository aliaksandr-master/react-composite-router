/* eslint-env browser, jest */
/* eslint-disable */

import React from 'react';
import Slot from '../Slot';
import renderer from 'react-test-renderer';
import WithContext from 'react-with-context';
import store from './__mocks__/redux-store';

describe('rendering', () => {
  it('should render something', () => {
    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', params: {} } }),
        router: {
          moveTo: () => {},
          onStateChange: () => {},
          getState: () => ({ name: '', params: {}, composition: {} }),
          createHref: () => ({ pathname: '/', search: '', hash: '' }),
          calcLocation: () => ({ name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' })
        }
      }}>
        <Slot name="some"><span>Hello!</span></Slot>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render fallback function', () => {
    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', params: {} } }),
        router: {
          moveTo: () => {},
          onStateChange: () => {},
          getState: () => ({ name: '', params: {}, composition: {} }),
          createHref: () => ({ pathname: '/', search: '', hash: '' }),
          calcLocation: () => ({ name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' })
        }
      }}>
        <Slot name="some">{() => (<span>Hello!</span>)}</Slot>
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render function', () => {
    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', params: {} } }),
        router: {
          moveTo: () => {},
          onStateChange: () => {},
          getState: () => ({ name: '', params: {}, composition: { some: true } }),
          createHref: () => ({ pathname: '/', search: '', hash: '' }),
          calcLocation: () => ({ name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' })
        }
      }}>
        <Slot name="some" render={() => (<span>Hello!</span>)} />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render slot', () => {
    const component = renderer.create(
      <WithContext context={{
        store: store({ routerState: { name: '', params: {} } }),
        router: {
          moveTo: () => {},
          onStateChange: () => {},
          getState: () => ({ name: '', params: {}, composition: { some: () => <span>Hello</span> } }),
          createHref: () => ({ pathname: '/', search: '', hash: '' }),
          calcLocation: () => ({ name: 'state', pathMaskParams: [], availableParams: [], searchParams: [], pathMask: '/' })
        }
      }}>
        <Slot name="some" />
      </WithContext>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
