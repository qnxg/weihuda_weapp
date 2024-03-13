/* eslint-disable import/no-commonjs */
module.exports = {
  extends: ['taro/react', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error']
  }
};
