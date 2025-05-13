/* eslint-disable import/no-commonjs */
module.exports = {
  "parserOptions": {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ['./tsconfig.json'],
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'taro/react',
    'prettier',
    'plugin:import/recommended',
    "plugin:import/typescript"
  ],
  plugins: ['prettier'],
  "settings": {
    "import/resolver": {
      "typescript": true,
      "node": true,
    },
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ]
  },
  rules: {
    'prefer-const': ['warn'],
    'no-var': ['error'],
    'no-shadow': 'off',
    'no-shadow-restricted-names': ["error"],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': ['warn'],
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/no-explicit-any': "off",
    '@typescript-eslint/no-shadow': ['off'],
    // 想消除这个警告，请在不需要await的promise前使用void关键字
    '@typescript-eslint/no-floating-promises': ['warn'],
    // 这个规则能够降低循环依赖的风险
    // 这个规则有可用的自动修复
    '@typescript-eslint/consistent-type-imports': ['warn'],
    "react/jsx-curly-brace-presence": "off",
    'import/first': ['error', 'disable-absolute-first'],
    'import/no-cycle': ['error', { maxDepth: 3 }],
    'import/no-self-import': "error",
    'import/no-named-as-default-member': "off",
    // import/order规则解决编译时css顺序问题
    // 这些警告通常有自动修复，使用eslint的--fix或者vscode上点击相关选项即可
    "import/order": ["warn", {
      groups: ["builtin", "external", "parent", "sibling", "index", "internal", "object", "type"],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
  }
};
