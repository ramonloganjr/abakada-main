import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Shared rules: ESLint recommended, with unused-vars relaxed to a warning that
// ignores intentional Capitalized/underscore-prefixed bindings.
const baseRules = {
  ...js.configs.recommended.rules,
  'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
  // Empty catch blocks are an intentional pattern here (best-effort localStorage,
  // IndexedDB, and fetch fallbacks that must never throw).
  'no-empty': ['error', { allowEmptyCatch: true }],
}

export default [
  { ignores: ['dist', 'node_modules', 'coverage'] },

  // Application source — browser globals + React Hooks / Fast Refresh rules.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...baseRules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Service worker — service-worker + browser globals.
  {
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: { ...globals.serviceworker, ...globals.browser },
    },
    rules: baseRules,
  },

  // Node tooling — build scripts and config files.
  {
    files: ['scripts/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: baseRules,
  },

  // Tests — Node built-in test runner (unit) and Playwright (e2e). `test`/`expect`
  // are imported, not globals, so plain node globals are enough here.
  {
    files: ['tests/**/*.{js,mjs}', 'e2e/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: baseRules,
  },
]
