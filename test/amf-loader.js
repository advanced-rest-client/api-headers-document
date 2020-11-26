import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();


AmfLoader.load = async function(compact, modelName) {
  if (!modelName) {
    modelName = 'demo-api'
  }
  const file = '/' + modelName + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      try {
        const data = JSON.parse(e.target.response);
        resolve(data);
      } catch (e) {
        /* istanbul ignore next */
        reject(e);
        return;
      }
    });
    /* istanbul ignore next */
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupOperation = function(model, endpoint, operation) {
  helper.amf = model;
  const webApi = helper._computeApi(model);
  const endPoint = helper._computeEndpointByPath(webApi, endpoint);
  const opKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupExpects = function(model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  return helper._computeExpects(op);
};

AmfLoader.lookupHeaders = function(model, endpoint, operation) {
  const exp = AmfLoader.lookupExpects(model, endpoint, operation);
  return helper._computeHeaders(exp);
};
