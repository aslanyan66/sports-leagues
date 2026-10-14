import { readdirSync } from 'node:fs';

import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import pluginQuery from '@tanstack/eslint-plugin-query';
import vitest from '@vitest/eslint-plugin';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Architecture: imports flow one way, shared -> features -> pages -> app.
const SHARED_LAYERS = [
  'api',
  'components',
  'config',
  'constants',
  'hooks',
  'lib',
  'store',
  'types',
  'utils',
];
const FEATURES = readdirSync('./src/features', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const PARENT_IMPORT_MESSAGE = 'Use the "@/" alias instead of parent-relative imports.';

// Modules with a public API (index.ts). Outside a module, import "@/<module>"; inside it, import
// files directly, since going through its own index.ts creates import cycles.
const PUBLIC_API_MODULES = [
  'components',
  'hooks',
  ...FEATURES.map((feature) => `features/${feature}`),
];
const parentImportPattern = { group: ['../*'], message: PARENT_IMPORT_MESSAGE };
const deepImportPattern = (module) => ({
  group: [`@/${module}/*`],
  message: `Import from "@/${module}" (its public API), not from a file inside it.`,
});

const publicApiConfigs = [
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [parentImportPattern, ...PUBLIC_API_MODULES.map(deepImportPattern)] },
      ],
    },
  },
  ...PUBLIC_API_MODULES.map((module) => ({
    files: [`src/${module}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: `@/${module}`, message: `Inside src/${module}, import the file directly.` },
          ],
          patterns: [
            parentImportPattern,
            ...PUBLIC_API_MODULES.filter((other) => other !== module).map(deepImportPattern),
          ],
        },
      ],
    },
  })),
  // Test setup and mocks build fixtures from feature internals (types, normalizers, store).
  {
    files: ['src/testing/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            parentImportPattern,
            deepImportPattern('components'),
            deepImportPattern('hooks'),
          ],
        },
      ],
    },
  },
];

const architectureZones = [
  // Features must not import from other features; compose them in pages/app instead.
  ...FEATURES.map((feature) => ({
    target: `./src/features/${feature}`,
    from: './src/features',
    except: [`./${feature}`],
    message: 'Features must not import from other features. Compose them in pages/ or app/.',
  })),
  {
    target: './src/features',
    from: ['./src/app', './src/pages'],
    message: 'Features must not import from app/ or pages/.',
  },
  {
    target: './src/pages',
    from: './src/app',
    message: 'Pages must not import from app/.',
  },
  ...SHARED_LAYERS.map((layer) => ({
    target: `./src/${layer}`,
    from: ['./src/features', './src/pages', './src/app'],
    message: `Shared code in src/${layer} must not depend on features, pages or app.`,
  })),
];

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      pluginQuery.configs['flat/recommended'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      /* ---------- TypeScript ---------- */
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      // Object shapes (DTOs, props, state) are interfaces named `IName`; unions/aliases stay `type`.
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: true },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      /* ---------- React ---------- */
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react/hook-use-state': 'error',

      /* ---------- React Hooks ---------- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* ---------- React Refresh ---------- */
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* ---------- Imports ---------- */
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: PARENT_IMPORT_MESSAGE,
            },
          ],
        },
      ],
      'import-x/no-restricted-paths': ['error', { zones: architectureZones }],
      'import-x/no-unresolved': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      /* ---------- General ---------- */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      // Hosts and endpoints live in .env (VITE_API_URL) and src/constants/api.ts, never inline.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^https?:\\/\\//]',
          message: 'Do not hardcode URLs. Use VITE_API_URL (src/config/env.ts) or src/constants.',
        },
        {
          selector: 'TemplateElement[value.raw=/^https?:\\/\\//]',
          message: 'Do not hardcode URLs. Use VITE_API_URL (src/config/env.ts) or src/constants.',
        },
      ],
    },
  },

  // Public APIs: outside a module, import its index.ts; inside it, import files directly.
  ...publicApiConfigs,

  // Tests: fixture URLs (example.com) are fine.
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/testing/**'],
    extends: [vitest.configs.recommended, testingLibrary.configs['flat/react']],
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-restricted-syntax': 'off',
    },
  },

  // Ambient declarations: names are fixed by Vite (ImportMetaEnv, ImportMeta) for declaration merging.
  {
    files: ['**/*.d.ts'],
    rules: { '@typescript-eslint/naming-convention': 'off' },
  },

  // Node-side config files (vite.config.ts, eslint.config.js)
  {
    files: ['*.config.{js,ts}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['*.config.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Must be last: runs Prettier as an ESLint rule and disables conflicting style rules.
  prettierRecommended,
]);
