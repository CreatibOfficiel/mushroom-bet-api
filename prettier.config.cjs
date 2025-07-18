module.exports = {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: ['^@nestjs', '<THIRD_PARTY_MODULES>', '^@/', '^[./]'],
    importOrderSeparation: true,
    importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  };
  