import { html, fixture, expect } from '@open-wc/testing';

import '../lazy-image.js';

describe('<lazy-image>', () => {
  it('has a default property ', async () => {
    const el = await fixture('<lazy-image></lazy-image>');

    expect(el.alt).to.equal('');
  });
});
