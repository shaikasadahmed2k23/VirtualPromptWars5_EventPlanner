import { CSP_DIRECTIVES, serializeCspForMeta } from './csp.js';

describe('serializeCspForMeta', () => {
  const policy = serializeCspForMeta();

  it('locks scripts and connections to the same origin', () => {
    expect(policy).toContain("script-src 'self'");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("object-src 'none'");
  });

  it('omits header-only directives that browsers ignore in meta tags', () => {
    expect(CSP_DIRECTIVES).toHaveProperty('frame-ancestors');
    expect(policy).not.toContain('frame-ancestors');
  });
});
