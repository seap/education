import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import adaptString from '../common/js/adapt';

export default class Html extends Component {
  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html>
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}

        <link rel="shortcut icon" href="/favicon.ico" />
        <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
        {Object.keys(assets.styles).map((style, key) =>
          <link href={assets.styles[style]} key={key} rel="stylesheet"
            type="text/css" charSet="UTF-8"
          />
        )}
      </head>
      <body>
      <script dangerouslySetInnerHTML={{ __html: adaptString }} />
      <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
      <script id="initialState" type="text/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(store.getState()) }} charSet="UTF-8"
      />
      <script src={assets.javascript.vendor} charSet="UTF-8" />
      <script src={assets.javascript.main} charSet="UTF-8" />
      {head.script.toComponent()}
      </body>
      </html>
    );
  }
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object
};
