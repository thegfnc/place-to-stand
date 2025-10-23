import js from '@eslint/js'
import nextConfig from 'eslint-config-next'

const eslintConfig = [
  js.configs.recommended,
  ...nextConfig,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
