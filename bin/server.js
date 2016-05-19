require('babel-register');
require('babel-polyfill');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const webpackIsomorphicAssets = require('../webpack/webpack-isomorphic-assets').default;
const rootDir = require('path').resolve(__dirname, '..');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicAssets)
  .development(__DEVELOPMENT__)
  .server(rootDir, () => {
    require('./www');
  });
