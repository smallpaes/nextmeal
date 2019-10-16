const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_base.scss";
          @import "@/scss/_mixins.scss";
        `
      }
    }
  },
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/'
      }
    }
  }
}