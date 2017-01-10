[![npm](http://img.shields.io/npm/v/react-composite-router.svg?style=flat-square)](https://www.npmjs.com/package/react-composite-router)
[![npm](http://img.shields.io/npm/l/react-composite-router.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/react-composite-router.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router)
[![devDependency Status](https://david-dm.org/aliaksandr-master/react-composite-router/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router#info=devDependencies)

# react-composite-router
create constant objects/array/... by deep object.defineProperty

```shell
$ npm install react-composite-router --save
```

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, Slot, createRoute, reducer as routerStateReducer } from 'react-composite-router';
import createBrowserHistory from 'history/createBrowserHistory';



const App = () => (<div>
  <h1>App!</h1>
  <Slot name="appBody"/>
</div>)

const SettingsBody = () => (<div>Settings Body!</div>);




const app = createRoute('app', {
  url: '/',
  slots: { root: App }
});

app.create('app.settings', {
  url: '/settings',
  slots: { appBody: SettingsBody }
});




const history = createBrowserHistory({
  basename: '/app'
});

const store = createStore(
  combineReducers({
    routerState: routerStateReducer
  })
);

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Slot name="root" />    
    </Router>
  </Provider>
);

render(<Root/>, document.getElementById('root'));
```

If you try to change any value inside - it throws an exception
