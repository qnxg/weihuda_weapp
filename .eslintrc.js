/* eslint-disable import/no-commonjs */
module.exports = {
  "parserOptions": {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ['./tsconfig.json', './tsconfig.node.json'],
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
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // 想消除这个警告，请在不需要await的promise前使用void关键字
    '@typescript-eslint/no-floating-promises': ['warn'],
    "react/jsx-curly-brace-presence": "off",
    'import/first': ['error', 'disable-absolute-first'],
    'import/no-cycle': ['error', { maxDepth: 3 }],
    'import/no-self-import': "error",
    'import/no-named-as-default-member': "off",
    // import/order规则是解决编译时css顺序问题所必须的
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
