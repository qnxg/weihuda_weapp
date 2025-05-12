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
    // 想强制消除这个错误，请在没有await的promise前使用void关键字
    '@typescript-eslint/no-floating-promises': ['error'],
    "react/jsx-curly-brace-presence": "off",
    'import/first': ['error', 'disable-absolute-first'],
    'import/no-cycle': ['error', { maxDepth: 3 }],
    'import/no-self-import': "error",
    'import/no-named-as-default-member': "off"
  }
};
