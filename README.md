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
import { Router, Slot, Link, routeFactory } from 'react-composite-router';
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
const routesTree = routeFactory();

const appRoute = routesTree.create('app', {
  url: '/?timeStamp',
  slots: { 
    root: App 
  },
  params: {
    timeStamp: Date.now() // default value
  }
});

appRoute.create('app.settings', {
  url: '/settings/:id',
  slots: { 
    appBody: SettingsBody 
  }
});




const history = createBrowserHistory({ basename: '/app' });

render(<Router history={history} routes={routesTree.getRoutes()}><Slot name="root" /></Router>, document.getElementById('root'));
```


## Router
Router.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  routes: routesPropTypes, // routes by name (returns from routesTree.getRoutes())
  history: PropTypes.object.isRequired // instance of history.js
};

history - instance of history.js

## Link
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

## Slot
```javascript

Slot.propTypes = {
  name: PropTypes.string.isRequired, // name of slot
  props: PropTypes.object, // props for component
  render: PropTypes.func, // render function (Component, props, stateParams, stateName)
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]) // fallback children (if slot will be empty in composition). function (props, stateParams, stateName)
};
```

## routeFactory::route::create(name, definition)

```javascript
const definition = {
  url: '/some/path/:id', // segment of url,
  params: {}, // default params
  slots: { // slots by name
    someSlotName: Component 
  }
};

const route = createRoute('some', definition);

route.create('some.child', definitionChild); // create an child. name must starts from parent name

```
