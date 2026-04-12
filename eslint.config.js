import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
 {
  ignores: ['dist/', 'node_modules/', 'coverage/', 'eslint.config.js'],
 },
 js.configs.recommended,
 ...tseslint.configs.recommended,
 {
  files: ['scripts/**/*.{js,mjs}'],
  languageOptions: {
   ecmaVersion: 'latest',
   sourceType: 'module',
   globals: {
    console: true,
    process: true,
    __dirname: true,
    __filename: true,
    Buffer: true,
    global: true,
   },
  },
  rules: {
   'no-undef': 'off',
  },
 },
 {
  files: ['public/**/*.js', 'index.html'],
  languageOptions: {
   ecmaVersion: 'latest',
   sourceType: 'script',
   globals: {
    window: true,
    document: true,
    localStorage: true,
    console: true,
    setTimeout: true,
    setInterval: true,
    requestAnimationFrame: true,
   },
  },
 },
 {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
   parserOptions: {
    ecmaFeatures: {
     jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
   },
   globals: {
    browser: true,
    es2021: true,
    node: true,
    chrome: true,
   },
  },
  plugins: {
   react,
   'react-hooks': reactHooks,
   'react-refresh': reactRefresh,
   prettier: prettierPlugin,
  },
  settings: {
   react: {
    version: 'detect',
   },
  },
  rules: {
   ...reactHooks.configs.recommended.rules,
   'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
   'react/react-in-jsx-scope': 'off',
   '@typescript-eslint/no-explicit-any': 'warn',
   '@typescript-eslint/no-unused-vars': [
    'warn',
    {
     argsIgnorePattern: '^_',
     varsIgnorePattern: '^_',
    },
   ],
   'no-useless-escape': 'off',
   '@typescript-eslint/no-empty-object-type': 'off',
   'react-hooks/exhaustive-deps': 'warn',
   'react-hooks/immutability': 'off',
   'prettier/prettier': [
    'error',
    {
     semi: false,
     trailingComma: 'es5',
     singleQuote: true,
     printWidth: 100,
     tabWidth: 2,
     useTabs: false,
     arrowParens: 'avoid',
     endOfLine: 'lf',
    },
   ],
  },
 },
]
