import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

export default
class Html extends Component {

  render() {
    const { component, store, locale, asset, csrf } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const initState = store.getState();

    const min = process.env.NODE_ENV === 'production' ? 'min.' : '';

    return (
      <html lang={locale}>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        {process.env.NODE_ENV === 'production' && <script src="https://unpkg.com/react@15.4.2/dist/react.min.js"></script>}
        {process.env.NODE_ENV === 'production' && <script src="https://unpkg.com/react-dom@15.4.2/dist/react-dom.min.js"></script>}
        <link href={`//${process.env.ASSET_HOST}/fonts.${min}css`} rel="stylesheet"/>
        <link href={`//${process.env.ASSET_HOST}/hooq.${min}css`} rel="stylesheet"/>
        <script dangerouslySetInnerHTML={{__html: `window.__locale=${serialize(locale)};window.__csrf=${serialize(csrf)}`}} charSet="UTF-8"/>
        <script src={`//${process.env.ASSET_HOST}/locales/${locale}.js`} />
        <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(initState)};`}} charSet="UTF-8"/>
      </head>
      <body id={`app-${asset}`}>
        <div id="react-root" dangerouslySetInnerHTML={{__html: content}}/>
        <script src={`//${process.env.SCRIPT_HOST}/commons.js`}></script>
        {process.env.NODE_ENV === 'production' && <script src={`//${process.env.SCRIPT_HOST}/commons.js`}></script>}
        {asset && <script src={`//${process.env.SCRIPT_HOST}/${asset}.js`}></script>}
      </body>
      </html>
    );
  }

}
