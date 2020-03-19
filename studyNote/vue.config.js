module.exports = {
  devServer: {
    open: true
  },
  configureWebpack (config) {
    config.externals = {
      'AMap': 'AMap' // 高德地图配置
    }
  }
  // proxy: {
  //   '/api': {
  //     target: 'https://www.fastmock.site/mock/a631aea78706aa57ccde0e1f11aac78d/demo',
  //     changeOrigin: true
  //   }
  // }
}
