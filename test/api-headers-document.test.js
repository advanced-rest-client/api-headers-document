import { fixture, assert, html, nextFrame, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-headers-document.js';

/** @typedef {import('..').ApiHeadersDocument} ApiHeadersDocument */

describe('ApiHeadersDocument', () => {
  /**
   * @returns {Promise<ApiHeadersDocument>}
   */
  async function openedFixture(amf, headers) {
    return (fixture(html`<api-headers-document
      opened
      .amf="${amf}"
      .headers="${headers}"></api-headers-document>`));
  }

  /**
   * @returns {Promise<ApiHeadersDocument>}
   */
  async function narrowFixture(amf, headers) {
    const elm = /** @type ApiHeadersDocument */ (await fixture(html`<api-headers-document
      opened narrow
      .amf="${amf}"
      .headers="${headers}"></api-headers-document>`));
    await aTimeout(0);
    return elm;
  }

  describe('a11y', () => {
    let element = /** @type ApiHeadersDocument */ (null);
    let amf;
    let headers;
    before(async () => {
      amf = await AmfLoader.load(0, 0);
      headers = AmfLoader.lookupHeaders(amf, '/test', 'get');
    });

    beforeEach(async () => {
      element = await openedFixture(amf, headers);
    });

    it('is accessible', async () => {
      await assert.isAccessible(element, { ignoredRules: ['color-contrast'] });
    });
  });

  [
    ['Full AMF model', false],
    ['Compact AMF model', true]
  ].forEach(([label, compact]) => {
    describe(String(label), () => {
      let element = /** @type ApiHeadersDocument */ (null);
      let amf;
      let headers;

      describe('No data state', () => {
        it('Renders no-info when opened', async () => {
          element = await openedFixture();
          const node = element.shadowRoot.querySelector('.no-info');
          assert.ok(node);
        });
      });

      describe('Model operations', () => {
        before(async () => {
          amf = await AmfLoader.load(compact);
          headers = AmfLoader.lookupHeaders(amf, '/test', 'get');
        });

        beforeEach(async () => {
          element = await openedFixture(amf, headers);
        });

        it('api-type-document is rendered', () => {
          const panel = element.shadowRoot.querySelector('api-type-document');
          assert.ok(panel);
        });

        it('no-info is not rendered when has data', () => {
          const node = element.shadowRoot.querySelector('.no-info');
          assert.notOk(node);
        });

        it('Toggle button hides the table', async () => {
          const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.section-title-area'));
          button.click();
          await nextFrame();
          const collapse = element.shadowRoot.querySelector('anypoint-collapse');
          assert.isFalse(collapse.opened);
        });
      });

      describe('Narrow layout', () => {
        before(async () => {
          amf = await AmfLoader.load(compact);
          headers = AmfLoader.lookupHeaders(amf, '/test', 'get');
        });

        beforeEach(async () => {
          element = await narrowFixture(amf, headers);
        });

        it('Has narrow attribute', () => {
          assert.isTrue(element.hasAttribute('narrow'));
        });

        it('no-info is not rendered when has data', () => {
          const node = element.shadowRoot.querySelector('.no-info');
          assert.notOk(node);
        });

        it('Narrow style is applied to the title', async () => {
          element.style.setProperty('--arc-font-subhead-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.headers-title');
          const { fontSize } = getComputedStyle(title);
          assert.equal(fontSize, '16px');
        });
      });

      describe('Title level', () => {
        before(async () => {
          amf = await AmfLoader.load(compact);
          headers = AmfLoader.lookupHeaders(amf, '/test', 'get');
        });

        beforeEach(async () => {
          element = await narrowFixture(amf, headers);
        });

        it('sets default header level', () => {
          const node = element.shadowRoot.querySelector('[role="heading"]');
          assert.equal(node.getAttribute('aria-level'), '2');
        });

        it('sets header level', async () => {
          element.headerLevel = 4;
          await aTimeout(0);
          const node = element.shadowRoot.querySelector('[role="heading"]');
          assert.equal(node.getAttribute('aria-level'), '4');
        });
      });

      describe('AsyncAPI', () => {
        const asyncApi = 'async-api';
        let asyncModel;

        before(async () => {
          asyncModel = await AmfLoader.load(compact, asyncApi);
          headers = AmfLoader.lookupHeaders(asyncModel, 'hello', 'publish');
        });

        beforeEach(async () => {
          element = await openedFixture(asyncModel, headers);
        });

        it('renders headers', () => {
          assert.exists(element.shadowRoot.querySelectorAll('api-type-document'));
        });
      });
    });
  });
});
