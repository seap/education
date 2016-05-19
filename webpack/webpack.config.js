import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpackIsomorphicAssets from './webpack-isomorphic-assets';
import config from '../config';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets);
const { host, hotPort: port } = config;
const rootDir = path.resolve(__dirname, '..');

export default {
  context: rootDir,
  devtool: 'cheap-module-source-map',
  entry: {
    vendor: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      'react', 'react-dom', 'react-router', 'redux', 'react-redux',
      'react-router-redux', 'redux-thunk'
    ],
    main: 'index'
  },
  output: {
    path: path.resolve(rootDir, 'public/dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash:8].js',
    publicPath: `http://${host}:${port}/static/`
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          compact: true,
          plugins: [
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module']
              }]
            }]
          ]
        }
      },
      {
        test: /\.scss$/,
        loader: [
          'style',
          'css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]',
          'postcss',
          'sass?sourceMap'
        ].join('!')
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|svg|eot|ttf)$/,
        loader: 'url?limit=8192'
      }
    ]
  },
  postcss: () => [autoprefixer({ browsers: ['last 2 versions', 'Android >= 2.3'] })],
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  resolve: {
    alias: {
      react: path.join(rootDir, 'node_modules', 'react')
    },
    extensions: ['', '.js'],
    root: path.join(rootDir, '/public/src'),
    modulesDirectories: ['node_modules']
  }
};
