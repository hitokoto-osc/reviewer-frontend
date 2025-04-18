// @ts-check

import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'
import { globalIgnores } from 'eslint/config'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  globalIgnores(['.stylelintrc.js']),
  ...pluginVue.configs['flat/recommended'],
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser
      },
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn'
    }
  }
)
