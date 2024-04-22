import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-headers-document.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'hasData',
      'headers'
    ]);
    this.componentName = 'api-headers-document';
    this.hasData = false;
  }

  _navChanged(e) {
    const { selected, type } = e.detail;

    if (type === 'method') {
      this.setData(selected);
    } else {
      this.hasData = false;
    }
  }

  setData(id) {
    const webApi = this._computeApi(this.amf);
    const method = this._computeMethodModel(webApi, id);
    const expects = this._computeExpects(method);
    let headers
    if(expects){
      headers = this._computeHeaders(expects);
    }else{
      const returns = this._computeReturns(method);
      headers = this._computeHeaderSchema(returns[0]);
    }
    this.headers = headers;
    this.hasData = true;
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['async-api', 'Async API'],
      ['jldAsync26', 'Async API 26'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  contentTemplate() {
    return html`
    ${this.hasData ?
      html`<api-headers-document .amf="${this.amf}" opened .headers="${this.headers}"></api-headers-document>` :
      html`<p>Select a HTTP method in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
