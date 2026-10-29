// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { cspMetaPlugin } from './cspMetaPlugin';

interface TagDescriptor {
  tag: string;
  attrs?: Record<string, string>;
}

function builtCsp(): string {
  const plugin = cspMetaPlugin();
  const hook = plugin.transformIndexHtml;
  if (typeof hook !== 'function') throw new Error('Expected a transformIndexHtml function hook');
  const tags = (hook as () => TagDescriptor[])();
  const content = tags.find((tag) => tag.attrs?.['http-equiv'] === 'Content-Security-Policy')?.attrs?.content;
  if (!content) throw new Error('CSP meta tag missing from build output');
  return content;
}

describe('cspMetaPlugin (production HTML)', () => {
  const policy = builtCsp();
  const directive = (name: string) => policy.split('; ').find((part) => part.startsWith(`${name} `)) ?? '';

  it('only applies to production builds', () => {
    expect(cspMetaPlugin().apply).toBe('build');
  });

  it('allows Unsplash photography', () => {
    expect(directive('img-src')).toContain('https://images.unsplash.com');
  });

  it('allows Google Fonts stylesheets and font files', () => {
    expect(directive('style-src')).toContain('https://fonts.googleapis.com');
    expect(directive('font-src')).toContain('https://fonts.gstatic.com');
  });

  it('keeps scripts and API calls same-origin', () => {
    expect(directive('script-src')).toBe("script-src 'self'");
    expect(directive('connect-src')).toBe("connect-src 'self'");
  });
});
