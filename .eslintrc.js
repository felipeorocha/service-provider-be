module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "arrow-parens": "off",
    "camelcase": "off",
  },
};
