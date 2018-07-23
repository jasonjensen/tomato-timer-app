/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { createMiddleware, createLoader, createIndexDBEngine } from '@jasonjensen/redux-storage';
// import createIndexDBEngine from './lib/redux-storage-engine-indexed-db.js';
import { createStore, compose as origCompose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app from './reducers/app.js';
import { timer } from './reducers/timer.js';
import { settings } from './reducers/settings.js';
import { logs } from './reducers/logs.js';
import { restoreState as restoreAppState } from './actions/app.js';
import { setTodayStart } from './actions/logs.js';
import { setTime } from './actions/timer.js';
// import { restoreState } from './actions/app.js';

const engine = createIndexDBEngine('tomatotimer-app-store');
const indexeddbMiddleware = createMiddleware(engine);

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk, indexeddbMiddleware))
);

// Initially loaded reducers.
store.addReducers({
  app,
  timer,
  settings,
  logs
});

// To load the previous state we create a loader function with our prepared
// engine. The result is a function that can be used on any store object you
// have at hand :)
const load = createLoader(engine);
// load(store);

// Notice that our load function will return a promise that can also be used
// to respond to the restore event.
load(store)
    .then((newState) => {
      // console.log('Loaded state:', newState);
      store.dispatch(restoreAppState(newState))
      store.dispatch(setTodayStart());
      if (newState && newState.settings && newState.settings.workLength) {
        store.dispatch(setTime(newState.settings.workLength));
      }
    })
    .catch(() => console.log('Failed to load previous state'));

