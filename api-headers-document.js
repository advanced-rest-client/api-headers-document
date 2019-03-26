import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@api-components/raml-aware/raml-aware.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@api-components/api-type-document/api-type-document.js';
import '../../@polymer/iron-collapse/iron-collapse.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-button/paper-button.js';
/**
 * `api-headers-document`
 *
 * A documentation for API headers.
 *
 * It uses [AMF](https://github.com/mulesoft/amf) json/ld model to render
 * the view.
 *
 * ## Example
 *
 * ```html
 * <api-headers-document headers="[...]" opened></api-headers-document>
 * ```
 *
 * ## Styling
 *
 * `<api-headers-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-headers-document` | Mixin applied to this elment | `{}`
 * `--api-headers-document-title-border-color` | Border color of the title area | `#e5e5e5`
 * `--api-headers-document-toggle-view-color` | Color of the toggle button | `--arc-toggle-view-icon-color` or `rgba(0, 0, 0, 0.74)`
 * `--toggle-button` | Theme style, mixin apllied to toggle button | `{}`
 * `--api-headers-document-toggle-view-hover-color` | Color of the toggle button when hovering. Please, mind that hover is not available on all devices.| `--arc-toggle-view-icon-hover-color` or `rgba(0, 0, 0, 0.88)`
 * `--toggle-button-hover` | Theme style, mixin apllied to toggle button when hovered. | `{}`
 * `--api-headers-document-title` | Mixin applied to the title element | `{}`
 * `--api-headers-document-title-narrow` | Mixin applied to the title when in narrow layout | `{}`
 * `--no-info-message` | Theme mixin, applied to all empty info messages | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
export class ApiHeadersDocument extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --api-headers-document;
    }

    [hidden] {
      display: none !important;
    }

    .section-title-area {
      @apply --layout-horizontal;
      @apply --layout-center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-bottom: 1px var(--api-headers-document-title-border-color, #e5e5e5) solid;
    }

    .section-title-area h3 {
      @apply --layout-flex;
    }

    .toggle-button {
      outline: none;
      color: var(--api-headers-document-toggle-view-color, var(--arc-toggle-view-icon-color, rgba(0, 0, 0, 0.74)));
      transition: color 0.25s ease-in-out;
      @apply --toggle-button;
    }

    .toggle-button:hover {
      color: var(--api-headers-document-toggle-view-hover-color, var(--arc-toggle-view-icon-hover-color, rgba(0, 0, 0, 0.88)));
      @apply --toggle-button-hover;
    }

    .toggle-icon {
      margin-left: 8px;
      transform: rotateZ(0deg);
      transition: transform 0.3s ease-in-out;
    }

    .toggle-icon.opened {
      transform: rotateZ(-180deg);
    }

    .headers-title {
      @apply --arc-font-title;
      @apply --api-headers-document-title;
    }

    .no-info {
      @apply --no-info-message;
    }

    :host([narrow]) .headers-title {
      @apply --api-headers-document-title-narrow;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <div class="section-title-area" on-click="toggle" title="Toogle headers details">
      <h3 class="headers-title">Headers</h3>
      <div class="title-area-actions">
        <paper-button class="toggle-button">
          [[_computeToggleActionLabel(opened)]]
          <iron-icon icon="arc:expand-more" class\$="[[_computeToggleIconClass(opened)]]"></iron-icon>
        </paper-button>
      </div>
    </div>
    <iron-collapse opened="[[opened]]">
      <template is="dom-if" if="[[hasHeaders]]">
        <api-type-document amf-model="[[amfModel]]" type="[[headers]]" narrow="[[narrow]]"></api-type-document>
      </template>
      <template is="dom-if" if="[[!hasHeaders]]">
        <p class="no-info">Headers are not required by this endpoint</p>
      </template>
    </iron-collapse>
`;
  }

  static get is() {
    return 'api-headers-document';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only usefult for the element to resolve references.
       *
       * @type {Object|Array}
       */
      amfModel: Object,
      /**
       * The headers AMF model Array.
       */
      headers: Array,
      /**
       * Computed value from the `headers`. True if has headers.
       */
      hasHeaders: {
        type: Boolean,
        value: false,
        computed: '_computeHasHeaders(headers.*)'
      },
      /**
       * Set to true to open the view.
       * Autormatically set when the view is toggle from the UI.
       */
      opened: Boolean,
      /**
       * A property passed to the type document element to render
       * a mogile friendly view.
       */
      narrow: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }
  /**
   * Computes value for `hasHeaders` property
   * @param {Object} record `headers` change record
   * @return {Boolean}
   */
  _computeHasHeaders(record) {
    return !!(record.base && record.base.length);
  }

  // Computes a label for the section toggle buttons.
  _computeToggleActionLabel(opened) {
    return opened ? 'Hide' : 'Show';
  }

  // Computes class for the toggle's button icon.
  _computeToggleIconClass(opened) {
    let clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  }
  /**
   * Toggles the view.
   * Use `opened` property instead.
   */
  toggle() {
    this.opened = !this.opened;
  }
}
window.customElements.define(ApiHeadersDocument.is, ApiHeadersDocument);
