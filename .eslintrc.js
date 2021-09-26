module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
  ],
  rules: {
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
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
  overrides: [
    /** Typesctipr overrides */
    // Declarations only
    {
      files: ['*.d.ts'],
      rules: {
        'no-var': 'off',
      },
    },
  ],
};
