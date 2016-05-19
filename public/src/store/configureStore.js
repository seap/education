import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import api from '../middleware/api';

export default function configureStore(history, initialState = undefined) {
  let devTools = [];
  const middlewares = [thunk, api, routerMiddleware(history)];
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const DevTools = require('../containers/DevTools').default;
    devTools = [window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()];
  }
  if (__DEVELOPMENT__ && __CLIENT__) {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger());
  }
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...devTools
    )
  );
  // Required for replaying actions from devtools to work
  // reduxRouterMiddleware.listenForReplays(store);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
