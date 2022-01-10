/**
 * Override convention configuration
 * https://cli.vuejs.org/config/
 */

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/edu-boss-fed/' : '/',
  indexPath: 'template/index.html',
  assetsDir: 'assets',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/boss': {
        target: 'http://127.0.0.1:8082',
        pathRewrite: { '^/boss': '/' },
        changeOrigin: true
      },
      '^/front': {
        target: 'http://127.0.0.1:8081',
        pathRewrite: { '^/front': '/' },
        changeOrigin: true
      }
    }
  }
}
