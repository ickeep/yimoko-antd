/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@/demo': path.resolve(__dirname, './src/_demo'),
      '@/library': path.resolve(__dirname, './src/library'),
    },
  },
};
