# DEPRECATED

This component is being deprecated. The code base has been moved to [api-documentation](https://github.com/advanced-rest-client/api-documentation) module. This module will be archived when [PR 37](https://github.com/advanced-rest-client/api-documentation/pull/37) is merged.

-----

Documentation component for API headers based on AMF data model.

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-headers-document.svg)](https://www.npmjs.com/package/@api-components/api-headers-document)

[![Tests and publishing](https://github.com/advanced-rest-client/api-headers-document/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-headers-document/actions/workflows/deployment.yml)

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-headers-document
```

### In an html file

```html
<html>
   <head>
     <script type="module">
       import '@api-components/api-headers-document/api-headers-document.js';
     </script>
   </head>
   <body>
     <api-headers-document></api-headers-document>
   </body>
</html>
```

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-headers-document/api-headers-document.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-headers-document .amf="${this.amf}"></api-headers-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/api-components/api-headers-document
cd api-headers-document
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
