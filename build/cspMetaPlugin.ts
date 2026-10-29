import type { Plugin } from 'vite';
import { serializeCspForMeta } from '../shared/csp';

/**
 * Injects the shared Content-Security-Policy as a `<meta>` tag into the
 * production HTML only. The dev server needs an inline HMR preamble that a
 * strict CSP would block, so the policy is applied at build time.
 */
export function cspMetaPlugin(): Plugin {
  return {
    name: 'utsav:csp-meta',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: serializeCspForMeta() },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}
