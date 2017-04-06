const webpack = require('webpack')
const path = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Webpack Config
module.exports = {
  entry: {
    'app': './src/main.ts',
    'vendor': [ 'rxjs', 'tslib' ]
  },

  output: {
    filename: 'bundle.js',
    // the output bundle

    path: path.join(process.cwd(), 'dist'),

    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/'
  },

  plugins: [
    new CheckerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[hash].js'}),
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        use: [ 'awesome-typescript-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader?importLoaders=1&sourceMap=true', 'css-loader?sourceMap=true']
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  },

  devtool: 'cheap-module-source-map',
  cache: true,

  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'css']
  },

  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: path.join(process.cwd(), 'dist'),
    // match the output path

    publicPath: '/',
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  }
}
