import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const PURE_LOGIC = 'Pure logic must not depend on React, UI, state, components, stores or hooks.';
const UI_PACKAGES = ['react', 'react-dom', 'react-router-dom', 'zustand', 'sonner', 'lucide-react'].map((name) => ({
  name,
  message: PURE_LOGIC,
}));
const UI_MODULES = { group: ['**/components/**', '**/store/**', '**/hooks/**'], message: PURE_LOGIC };
const APP_MODULES = { group: ['@/*', '**/src/**'], message: 'shared/ must not import from src/.' };

export default tseslint.config(
  { ignores: ['dist', 'dist-server', 'coverage', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    // The route table declares lazy page components but is never hot-swapped itself.
    files: ['src/app/router.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    // Size and complexity budgets for production code. Tests, fixtures and static
    // content tables (seed data, demo copy) are data, not logic, so they are exempt.
    files: ['src/**/*.{ts,tsx}', 'server/**/*.ts', 'shared/**/*.ts', 'build/**/*.ts'],
    ignores: [
      '**/*.test.{ts,tsx}',
      'src/test/**',
      'server/test/**',
      'src/data/**',
      'shared/demo/planContent.ts',
      'shared/demo/themeLibrary.ts',
    ],
    rules: {
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      'no-nested-ternary': 'error',
    },
  },
  {
    // Shared logic is imported from many places, so its signatures are spelled out.
    files: [
      'src/lib/**/*.ts',
      'src/features/*/lib/**/*.ts',
      'src/features/*/hooks/**/*.ts',
      'server/**/*.ts',
      'shared/**/*.ts',
    ],
    ignores: ['**/*.test.ts', 'server/test/**'],
    rules: { '@typescript-eslint/explicit-module-boundary-types': 'error' },
  },
  {
    // Layering: feature lib/ and shared/ are pure business logic. They may not
    // reach for React, UI, stores or hooks, so they stay unit-testable in Node.
    files: ['src/features/*/lib/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-imports': ['error', { paths: UI_PACKAGES, patterns: [UI_MODULES] }] },
  },
  {
    // shared/ is also compiled into the server, so it cannot see browser-only src/ either.
    files: ['shared/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-imports': ['error', { paths: UI_PACKAGES, patterns: [UI_MODULES, APP_MODULES] }] },
  },
  {
    files: ['**/*.{ts,tsx,js}'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      // Packages, then @shared, then @/ app modules, then relative imports.
      'simple-import-sort/imports': [
        'error',
        { groups: [['^\\u0000', '^node:', '^@?\\w', '^@shared(/.*)?$', '^@/', '^\\.']] },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
);
