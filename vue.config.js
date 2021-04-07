const path = require("path");

module.exports = {
  publicPath: process.env.VUE_APP_STATIC_URL,
  outputDir: path.resolve(__dirname, "dist/static", "survey"),
  indexPath: path.resolve(__dirname, "dist/templates/", "survey", "index.html"),
};

module.exports={
  devServer:{
      proxy:{
          [""]:{
          target:'http://localhost:8000',
            changeOrigin:true,
              pathRewrite: {
                  '^' : '/'
              }
          }
      }

  }
}

