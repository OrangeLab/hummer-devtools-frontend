const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  devServer: {
    writeToDisk: true,
    watchContentBase: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    }
  },
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    debug: {
      entry: 'src/pages/debug/main.js',
      template: 'public/debug.html',
      filename: 'debug.html'
    }
  }
}
