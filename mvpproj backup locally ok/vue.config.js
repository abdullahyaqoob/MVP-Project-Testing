module.exports = {
  devServer: {
    proxy: {
      "/one": {
        target: "https://etherscan.io/",
        pathRewrite: { "^/one": "" },
      },
      // "/one": {
      //   target: "https://etherscan.io/",
      //   pathRewrite: { "^/one": "" },
      // },
      "/two": {
        target: "https://bscscan.com/",
        pathRewrite: { "^/two": "" },
      },
      "/three": {
        target: 'https://api.opensea.io/',
        changeOrigin: true,
        pathRewrite: {
          '^/three': ''
        }
      }
    },
  },
};
