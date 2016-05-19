import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { match, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import route from './routes';

// React Performance Testing
if (__DEVELOPMENT__) {
  window.ReactPerf = require('react/lib/ReactDefaultPerf');
}

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

const initialState = JSON.parse(document.getElementById('initialState').innerHTML);
const store = configureStore(browserHistory, initialState);

// add Plugin for React Tap Event
injectTapEventPlugin();

const routes = route(store);
match({ routes, location }, () => {
  render(
    <Root store={store} routes={routes} />,
    document.getElementById('root')
  );
});
