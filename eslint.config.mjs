import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import eslintRules from './eslint-rules/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    extends: fixupConfigRules(
      compat.extends(
        'plugin:react/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript'
      )
    ),

    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      local: eslintRules,
    },

    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect',
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },

    rules: {
      'local/no-sus-usepromise': ['warn'],
      'local/no-unstable-usepromise': ['error'],

      'prefer-const': ['warn'],
      'no-var': ['error'],
      'no-shadow': 'off',
      'no-shadow-restricted-names': ['error'],
      'no-unsafe-finally': ['warn'],

      'react-hooks/exhaustive-deps': ['warn'],
      'react-hooks/rules-of-hooks': ['warn'],
      'react-hooks/component-hook-factories': ['warn'],
      'react-hooks/config': ['warn'],
      'react-hooks/error-boundaries': ['warn'],
      'react-hooks/gating': ['warn'],
      'react-hooks/globals': ['warn'],
      'react-hooks/immutability': ['warn'],
      'react-hooks/incompatible-library': ['warn'],
      'react-hooks/preserve-manual-memoization': ['warn'],
      'react-hooks/purity': ['warn'],
      'react-hooks/refs': ['warn'],
      'react-hooks/set-state-in-render': ['warn'],
      'react-hooks/static-components': ['warn'],
      'react-hooks/unsupported-syntax': ['warn'],
      'react-hooks/use-memo': ['warn'],

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // 关闭，因为在下面的@typescript-eslint规则中配置了
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': ['warn'],
      '@typescript-eslint/no-empty-object-type': ['warn'],
      '@typescript-eslint/no-unsafe-function-type': ['warn'],
      '@typescript-eslint/no-wrapper-object-types': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-shadow': ['off'],
      // 想消除这个警告，请在不需要await的promise前使用void关键字
      '@typescript-eslint/no-floating-promises': ['warn'],
      // 这个规则能够降低循环依赖的风险
      // 这个规则有可用的自动修复
      '@typescript-eslint/consistent-type-imports': ['warn'],
      '@typescript-eslint/no-deprecated': 'warn',
      'react/jsx-curly-brace-presence': 'off',

      // 小程序特殊规则
      'no-restricted-globals': [
        'error',
        'error',
        'isFinite',
        'isNaN',
        'addEventListener',
        'blur',
        'close',
        'closed',
        'confirm',
        'defaultStatus',
        'event',
        'external',
        'defaultstatus',
        'find',
        'focus',
        'frameElement',
        'frames',
        'history',
        'innerHeight',
        'innerWidth',
        'length',
        'location',
        'locationbar',
        'menubar',
        'moveBy',
        'moveTo',
        'name',
        'onblur',
        'onerror',
        'onfocus',
        'onload',
        'onresize',
        'onunload',
        'open',
        'opener',
        'opera',
        'outerHeight',
        'outerWidth',
        'pageXOffset',
        'pageYOffset',
        'parent',
        'print',
        'removeEventListener',
        'resizeBy',
        'resizeTo',
        'screen',
        'screenLeft',
        'screenTop',
        'screenX',
        'screenY',
        'scroll',
        'scrollbars',
        'scrollBy',
        'scrollTo',
        'scrollX',
        'scrollY',
        'self',
        'status',
        'statusbar',
        'stop',
        'toolbar',
        'top',
      ],

      'import/first': ['error', 'disable-absolute-first'],
      'import/no-cycle': [
        'error',
        {
          maxDepth: 3,
        },
      ],
      'import/no-self-import': 'error',
      // 这个名称难以理解，但是遇到这个警告有一种情况是你导出（export）+ 默认导出（export default）了同一个东西
      'import/no-named-as-default-member': 'warn',
      'import/no-commonjs': 'error',
      // import/order规则解决编译时css顺序问题
      // 这些警告通常有自动修复，使用eslint的--fix或者vscode上点击相关选项即可
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'internal',
            'object',
            'type',
          ],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.jsx', '**/*.js'],
  },
  globalIgnores(['**/*.min.js', '**/.*.js', 'src/workers/**']),
])
