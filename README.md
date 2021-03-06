[![npm](http://img.shields.io/npm/v/react-composite-router.svg?style=flat-square)](https://www.npmjs.com/package/react-composite-router)
[![npm](http://img.shields.io/npm/l/react-composite-router.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/react-composite-router.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router)
[![devDependency Status](https://david-dm.org/aliaksandr-master/react-composite-router/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router#info=devDependencies)
[![peerDependency Status](https://david-dm.org/aliaksandr-master/react-composite-router/peer-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router?type=peer)

# react-composite-router
Create predictable ui composition by declaration of the routes tree.

Without Url sharing in any Link or other places. Url must be hidden!

```shell
$ npm install react-composite-router --save
```

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, Slot, Link, routesTree } from 'react-composite-router';
import createBrowserHistory from 'history/createBrowserHistory';



const App = () => (
  <div>
    <h1>App!</h1>
    <Link state="app.settings" params={{ id: 123 }}>Settings</Link>
    <Slot name="appBody" />
  </div>
)

const SettingsBody = ({ timeStamp, id }) => (
  <div>Settings Body! {id}:{timeStamp}</div>
);



// define the routes tree
const tree = routesTree();

const appRoute = tree.createRootRoute('app', {
  url: '/?timeStamp',
  slots: { 
    root: App 
  },
  params: {
    timeStamp: Date.now() // default value
  }
});

appRoute.createChildRoute('app.settings', {
  url: '/settings/:id',
  slots: { 
    appBody: SettingsBody 
  }
});




const history = createBrowserHistory({ basename: '/app' });

render(<Router history={history} routes={routesTree.getRoutes()}><Slot name="root" /></Router>, document.getElementById('root'));
```


## &lt;Router /&gt;
```javascript
Router.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  routes: routesPropTypes, // routes by name (returns from routesTree.getRoutes())
  history: PropTypes.object.isRequired // instance of history.js
};
```

history - instance of history.js

## &lt;Link /&gt;
```javascript
Link.propTypes = {
  state: PropTypes.string.isRequired, // state name
  reset: PropTypes.bool, // set true, if you want to reset inherited params for transition 
  params: PropTypes.object.isRequired, // stateParams
  reload: PropTypes.bool.isRequired, // if it is true page will be reloaded after click  
  replace: PropTypes.bool.isRequired, // history.replace
  onClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  activeStateClass: PropTypes.string,  // when state or child of this state will be active
  activeClass: PropTypes.string, // only if this state will be active
  disabledClass: PropTypes.string // only if link is disabled
}
```

## &lt;Redirect /&gt;
```javascript
Redirect.propTypes = { // the same description as Link has 
  state: PropTypes.string.isRequired,
  reset: PropTypes.bool,
  params: PropTypes.object,
  reload: PropTypes.bool,
  replace: PropTypes.bool
}
```

## &lt;Slot /&gt;
```javascript

Slot.propTypes = {
  name: PropTypes.string.isRequired, // name of slot
  props: PropTypes.object, // props for component
  render: PropTypes.func, // render function (Component, props, stateParams, stateName)
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]) // fallback children (if slot will be empty in composition). function (props, stateParams, stateName)
};
```

## routesTree().createRootRoute(name, definition)
### routesTree().createRootRoute(name, definition).createChildRoute(childName, definition);

name - String - required

```javascript
const definition = {
  url: '/some/path/:id', // segment of url,
  params: {}, // default params
  slots: { // slots by name
    someSlotName: Component 
  }
};
```


usage
```javascript
import { routesTree } from 'react-composite-router';

const tree = routesTree();

const route = routesTree.createRootRoute('some', { url: '/some' });

route.createChildRoute('some.child', { url: '/child' }); // create an child. name must starts from parent name

```


# HOCs

## referring('_statePropName', mapPropsFunc)(Component)

Provide possibility to create your own link or button.

New Component will recognize additional props like:
```
mapPropsFunc = (props) => ({
  state: PropTypes.string.isRequired,
  reset: PropTypes.bool,
  params: PropTypes.object,
  reload: PropTypes.bool,
  replace: PropTypes.bool
})
```

```javascript
let MyComponent = ({ state, children, ...otherProps }) => (
  <div {...otherProps} data-href={state.href} onClick={() => state.apply()}>{children}</div>
);

MyComponent.propTypes = {
  state: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired, // name of state
    apply: PropTypes.func.isRequired, // function for calling if some event was fired 
    params: PropTypes.object.isRequired, // state params
    isActive: PropTypes.bool.isRequired, // true if this state is active (exactly)
    isActiveState: PropTypes.bool.isRequired // true if this state or child of this state is active
  })
};

MyComponent = referring()(MyComponent);

<MyComponent state="my-state-name" params={{ someParam: 3 }} reload={true} replace={false} reset={true}/>Some</MyComponent>;

```

# Using with redux

this router provide simple redux-reducer. it useful if you are lazy as me =) 

```javascript

import { createStore, combineReducers } from 'redux';
import routerReducer, { changeStateAction } from 'react-composite-router/lib/redux/reducer';

const store = createStore(
  combineReducers({
    routing: routerReducer   
  })
);

const onStateChange = (name, params) => {
  store.dispatch(changeStateAction(name, params)); // deliberately call store.dispatch or create special handler. up to you
};

render(<Router history={history} onChange={onStateChange} routes={routesTree.getRoutes()}><Slot name="root" /></Router>, document.getElementById('root'));
```
