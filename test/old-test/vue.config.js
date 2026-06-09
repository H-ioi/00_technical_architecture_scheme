// 配置代理服务地址
const NODE_ENV = process.env.NODE_ENV;
const BASE_URL = process.env.VUE_APP_BASE_URL;
const uploadUrl = "https://upload.isagzth.com";
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const Timestamp = new Date().getTime();
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  // 配置转发代理
  devServer: {
    port: 8020,
    proxy: {
      // "/isacommunity": {
      //   target: "http://127.0.0.1:8094",
      //   ws: true, // 需要websocket 开启
      //   pathRewrite: {
      //     "^/isacommunity": "/",
      //   },
      // },
      '/': {
        target: BASE_URL,
        ws: true, // 需要websocket 开启
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  chainWebpack: (config) => {
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()
  },
  css: {
    // 忽略 CSS order 顺序警告
    extract: {
      ignoreOrder: true
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 仅在生产环境下启用该配置
      return {
        performance: {
          // 打包后最大文件大小限制
          maxAssetSize: 1024000
        },
        output: {
          // 输出重构 打包编译后的 文件名称 【模块名称.版本号.时间戳】
          filename: `static/js/[name].${Timestamp}.js`,
          chunkFilename: `static/js/[name].${Timestamp}.js`
        },
        plugins: [
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            filename: '[path].gz[query]',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 1024, // 只有大小大于该值的资源会被处理,当前配置为对于超过1k的数据进行处理，不足1k的可能会越压缩越大
            minRatio: 0.99, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
          })
        ]
      }
    }
  }
}
