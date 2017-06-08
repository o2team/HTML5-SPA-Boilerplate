const _ = require('lodash')
const {
  resolveApp,
  resolveOwn
} = require('./resolve.js')
const {
  getPlugins
} = require('./plugins.js')
const allConfig = require('../config/index.js')

const NODE_ENV = process.env.NODE_ENV || ''
const config = _.merge({}, allConfig, allConfig[NODE_ENV.toUpperCase()])

const zeptoPath = require.resolve('zepto')

const baseConfig = {
  output: _.merge({}, config.output, {
    path: resolveApp(config.output.path)
  }),
  resolve: {
    extensions: ['.js', '.css', '.scss', '.less', '.styl'],
    alias: {
      src: resolveApp('src')
    }
  },
  resolveLoader: {
    // moduleExtensions: ['-loader'],
    modules: [resolveApp('node_modules'), resolveOwn('node_modules')]
  },
  module: {
    rules: [{
      test: zeptoPath,
      use: [{
        loader: 'exports-loader',
        options: 'window.$'
      }, 'script-loader']
    }, {
      test: /\.(aac|mp3|mp4|webm|mov|ogg|ogv)(\?\S*)?$/,
      use: [{
        loader: 'file-loader',
        options: config.audioLoaderQuery
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: config.enableHTMLCompress
        }
      }]
    }].concat(config.rules)
  },
  plugins: getPlugins(config),
  externals: config.externals || {}
}

if (config.enableBabel) {
  baseConfig.module.rules.push(
    {
      // Skip any files outside of your project's `src` directory
      include: /src/,
      exclude: /(node_modules|bower_components)/,

      // Only run `.js` and `.jsx` files through Babel
      test: /\.jsx?$/,

      use: [{
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          babelrc: true,
        }
      }]
    }
  )
}

module.exports = baseConfig
