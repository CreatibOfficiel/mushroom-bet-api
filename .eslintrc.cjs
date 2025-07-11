module.exports = {
    root: true,
    env: { node: true, es2021: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'],
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'error',
    },
  };
  