import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['dist/**', 'node_modules/**', 'src/**/__tests__/**', '*.md'],
  rules: {
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreTrailingComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
  },
})
