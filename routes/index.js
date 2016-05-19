import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createStore from '../public/src/store/configureStore';
import Html from '../public/src/containers/Html';
import route from '../public/src/routes';

const router = express.Router();

function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce((prev, current) =>
    // (current.needs || [])
    //   .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
    //   .concat(prev)
      current ? (current.needs || []).concat(prev) : prev
  , []);
  const promises = needs.map(need => dispatch(need(params)));
  return Promise.all(promises);
}

function isV4Format(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
  return ipv4Regex.test(ip);
};

function isV6Format(ip) {
  const ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
  return ipv6Regex.test(ip);
};

router.use((req, res) => {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const ip = isV6Format(req.ip) ? req.ip.slice(7) : req.ip;
  const store = createStore(memoryHistory, {ip: ip});
  const history = syncHistoryWithStore(memoryHistory, store);
  const hydrateOnClient = (status = 200) => {
    const html = ReactDOM.renderToString(
      <Html assets={webpackIsomorphicTools.assets()} store={store} />
    );
    res.status(status).send(`<!doctype html>\n${html}`);
  };

  if (__DISABLE_SSR__) {
    return hydrateOnClient();
  }

  function render(renderProps) {
    const component = (
      <Provider store={store} key="provider">
      <div><RouterContext {...renderProps} /></div>
      </Provider>
    );
    const html = ReactDOM.renderToString(
      <Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />
    );
    return res.status(200).send(`<!doctype html>\n${html}`);
  }

  const routes = route(store);
  return match({ history, routes, location: req.originalUrl}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return res.redirect(redirectLocation.pathname + redirectLocation.search);
    }

    if (error) {
      console.error('ROUTER ERROR:', error);
      return hydrateOnClient(500);
    }
    if (renderProps) {
      return fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
        .then(() => render(renderProps))
        .catch((e) => {
          console.error('Render error: ', e);
          hydrateOnClient();
        });
    }

    return hydrateOnClient(404);
  });
});

export default router;
