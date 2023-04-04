const path = require('path')

const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config({ path: "../.env" });
dotenvExpand(myEnv);

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
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
        target: 'https://nextmeal.herokuapp.com/'
      }
    },
    disableHostCheck: true
  }
}
