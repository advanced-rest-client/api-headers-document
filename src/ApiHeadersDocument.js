/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit-element';
import '@api-components/api-type-document/api-type-document.js';
import '@anypoint-web-components/anypoint-collapse/anypoint-collapse.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
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
 */
export class ApiHeadersDocument extends LitElement {
  get styles() {
    return css`:host {
      display: block;
    }

    [hidden] {
      display: none !important;
    }

    .section-title-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px var(--api-headers-document-title-border-color, var(--api-parameters-document-title-border-color, #e5e5e5)) solid;
      cursor: pointer;
      user-select: none;
      transition: border-bottom-color 0.15s ease-in-out;
    }

    .section-title-area[data-opened] {
      border-bottom-color: transparent;
    }

    .toggle-icon {
      margin-left: 8px;
      transform: rotateZ(0deg);
      transition: transform 0.3s ease-in-out;
    }

    .toggle-icon.opened {
      transform: rotateZ(-180deg);
    }

    .heading3 {
      flex: 1;
      color: var(--arc-font-subhead-color);
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
    }

    :host([narrow]) .heading3 {
      font-size: var(--api-headers-document-title-narrow-font-size, var(--arc-font-subhead-narrow-font-size, 17px));
    }

    .no-info {
      font-style: var(--no-info-message-font-style, italic);
      font-size: var(--no-info-message-font-size, 16px);
      color: var(--no-info-message-color, rgba(0, 0, 0, 0.74));
    }

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }`;
  }

  render() {
    const { opened, headers, amf, narrow, compatibility, headerLevel, graph } = this;
    const hasHeaders = !!(headers) && (!!headers.length || !!Object.keys(headers).length);
    return html`<style>${this.styles}</style>
    <div
      class="section-title-area"
      @click="${this.toggle}"
      title="Toggle headers details"
      ?data-opened="${opened}"
    >
      <div class="heading3" role="heading" aria-level="${headerLevel}">Headers</div>
      <div class="title-area-actions">
        <anypoint-button class="toggle-button" ?compatibility="${compatibility}">
          ${this._computeToggleActionLabel(opened)}
          <arc-icon class="icon ${this._computeToggleIconClass(opened)}" icon="expandMore"></arc-icon>
        </anypoint-button>
      </div>
    </div>

    <anypoint-collapse .opened="${opened}">
      ${hasHeaders ?
        html`<api-type-document
          .amf="${amf}"
          .type="${headers}"
          ?narrow="${narrow}"
          ?graph="${graph}"
          noExamplesActions
        ></api-type-document>` :
        html`<p class="no-info">Headers are not required by this endpoint</p>`}
    </anypoint-collapse>`;
  }

  static get properties() {
    return {
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only useful for the element to resolve references.
       */
      amf: { type: Object },
      /**
       * The headers AMF model Array.
       */
      headers: { type: Array },
      /**
       * Set to true to open the view.
       * Automatically set when the view is toggle from the UI.
       */
      opened: { type: Boolean },
      /**
       * A property passed to the type document element to render a mobile friendly view.
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean },
      /**
       * Type of the header in the documentation section.
       * Should be in range of 1 to 6.
       *
       * @default 2
       */
      headerLevel: { type: Number },
      /**
       * Passed to `api-type-document`. Enables internal links rendering for types.
       */
      graph: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.headerLevel = 2;
    /**
     * @type {any[]}
     */
    this.headers = undefined;
    this.amf = undefined;
    this.narrow = false;
    this.compatibility = false;
    this.graph = false;
  }

  // Computes a label for the section toggle buttons.
  _computeToggleActionLabel(opened) {
    return opened ? 'Hide' : 'Show';
  }

  // Computes class for the toggle's button icon.
  _computeToggleIconClass(opened) {
    let classes = 'toggle-icon';
    if (opened) {
      classes += ' opened';
    }
    return classes;
  }

  /**
   * Toggles the view.
   * Use `opened` property instead.
   */
  toggle() {
    this.opened = !this.opened;
  }
}