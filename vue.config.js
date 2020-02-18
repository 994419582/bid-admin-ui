module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  devServer: {
    // 端口配置
    port: 80,
    // 反向代理配置
    proxy: {
      '/api': {
        // target: 'http://192.168.150.39:9000',
        // target: 'http://127.0.0.1:8080',
        target: 'http://36.112.25.14:8000',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    public: '10.7.40.161:1024'
  }
}
