import { html } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-headers-document.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.initObservableProperties([
      'hasData',
      'headers'
    ]);
    this.componentName = 'api-headers-document';
    this.hasData = false;
  }

  get helper() {
    if (!this.__helper) {
      this.__helper = document.getElementById('helper');
    }
    return this.__helper;
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
    const helper = this.helper;
    const webApi = helper._computeApi(this.amf);
    const method = helper._computeMethodModel(webApi, id);
    const expects = helper._computeExpects(method);
    const headers = helper._computeHeaders(expects);
    this.headers = headers;
    this.hasData = true;
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['async-api', 'Async API'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    ${this.hasData ?
      html`<api-headers-document .amf="${this.amf}" opened aware="model" .headers="${this.headers}" ?narrow="${this.narrowActive}"></api-headers-document>` :
      html`<p>Select a HTTP method in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
window._demo = instance;
