// eslint-disable-next-line import/no-commonjs
const path = require('path');

// eslint-disable-next-line import/no-commonjs
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    }
  }
};
