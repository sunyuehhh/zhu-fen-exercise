const vue = require('@vitejs/plugin-vue')
const path = require('path')

module.exports = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
