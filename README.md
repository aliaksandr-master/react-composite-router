[![npm](http://img.shields.io/npm/v/react-composite-router.svg?style=flat-square)](https://www.npmjs.com/package/react-composite-router)
[![npm](http://img.shields.io/npm/l/react-composite-router.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/react-composite-router.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router)
[![devDependency Status](https://david-dm.org/aliaksandr-master/react-composite-router/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-composite-router#info=devDependencies)

# react-composite-router
Create predictable ui composition by declaration of the routes tree.
Without Url sharing in any Link or other places.
Url must be hidden!

```shell
$ npm install react-composite-router --save
```

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, Slot, Link, createRoute, reducer as routerStateReducer } from 'react-composite-router';
import createBrowserHistory from 'history/createBrowserHistory';



const App = () => (<div>
  <h1>App!</h1>
  <Link to="app.settings" params={{ id: 123 }}>Settings</Link>
  <Slot name="appBody">{(FillerComponent, props, params) => (
    <FillerComponent {...props} timeStamp={params.timeStamp} id={params.id} />
  )}</Slot>
</div>)

const SettingsBody = ({ timeStamp, id }) => (<div>Settings Body! {id}:{timeStamp}</div>);



// define the routes tree
const app = createRoute('app', {
  url: '/',
  slots: { root: App },
  params: {
    timeStamp: Date.now()
  }
});

app.create('app.settings', {
  url: '/settings/:id',
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
