module.exports = {
  devServer: {
    open: true
  },
  configureWebpack (config) {
    // ...

    config.externals = {
      'AMap': 'AMap' // 高德地图配置
    }
  }
}
