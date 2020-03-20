module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    // 配置跨域
    proxy: {
      '/api': {
        target: 'https://www.fastmock.site/mock/a631aea78706aa57ccde0e1f11aac78d/demo',
        changeOrigin: true
        // pathRewrite: {
        //   '^/api': 'https://www.fastmock.site/mock/a631aea78706aa57ccde0e1f11aac78d'
        // }
      }
    }
  },
  configureWebpack (config) {
    config.externals = {
      'AMap': 'AMap' // 高德地图配置
    }
  }

}
