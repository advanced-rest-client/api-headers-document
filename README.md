[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-headers-document.svg)](https://www.npmjs.com/package/@api-components/api-headers-document)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-headers-document.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-headers-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-headers-document)

## api-headers-document

Documentation component for API headers based on AMF data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Styling

`<api-headers-document>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--arc-font-subhead-color` | Color of the collapsible section title | ``
`--arc-font-subhead-font-size` | Font size of the collapsible section title | ``
`--arc-font-subhead-line-height` | Line height of the collapsible section title | ``
`--arc-font-subhead-narrow-font-size` | Font size of the collapsible section title in mobile-friendly view | ``
`--api-parameters-document-title-border-color` | Border color of the collapsible section title area | `#e5e5e5`
`--no-info-message-font-style` |   |  `italic`
`--no-info-message-font-size`  |   |  `16px`
`--no-info-message-color`  |   |  `rgba(0, 0, 0, 0.74)`

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

## API components

This component is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
