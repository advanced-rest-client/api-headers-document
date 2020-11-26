import { fixture, assert, html, nextFrame, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '@api-components/raml-aware/raml-aware.js';
import '../api-headers-document.js';

describe('<api-headers-document>', function() {
  async function openedFixture(amf, headers) {
    return (await fixture(html`<api-headers-document
      opened
      .amf="${amf}"
      .headers="${headers}"></api-headers-document>`));
  }

  async function narrowFixture(amf, headers) {
    const elm = (await fixture(html`<api-headers-document
      opened narrow
      .amf="${amf}"
      .headers="${headers}"></api-headers-document>`));
    await aTimeout();
    return elm;
  }

  async function awareFixture() {
    return (await fixture(`<div>
      <api-headers-document aware="test-model"></api-headers-document>
      <raml-aware scope="test-model"></raml-aware>
      </div>`));
  }

  describe('Raml aware', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      const region = await awareFixture();
      element = region.querySelector('api-headers-document');
      region.querySelector('raml-aware').api = amf;
    });

    it('renders raml-aware', () => {
      const node = element.shadowRoot.querySelector('raml-aware');
      assert.ok(node);
    });

    it('sets amf value from aware', async () => {
      await aTimeout();
      assert.typeOf(element.amf, 'array');
    });
  });

  describe('a11y', () => {
    let element;
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

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await openedFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await openedFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  [
    ['Full AMF model', false],
    ['Compact AMF model', true]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      let element;
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
          const button = element.shadowRoot.querySelector('.section-title-area');
          button.click();
          await nextFrame();
          const collapse = element.shadowRoot.querySelector('iron-collapse');
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
          element.style.setProperty('--api-headers-document-title-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.headers-title');
          const fontSize = getComputedStyle(title).fontSize;
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
          await aTimeout();
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
