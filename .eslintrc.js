module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:node/recommended', 'plugin:security/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'object-curly-newline': 'off',
    'comma-dangle': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    camelcase: 'off',
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
  },
  ignorePatterns: ['.eslintrc.js'],
};
