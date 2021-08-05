module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    writeToDisk: true,
    watchContentBase: true
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
