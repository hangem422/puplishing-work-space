const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const postcssNormalize = require('postcss-normalize');

const config = require('./config');

module.exports = {
  mode: config.mode,
  entry: config.jsPath,
  output: {
    filename: config.jsName,
    publicPath: '/',
    path: path.resolve(`${__dirname}/build`),
  },
  optimization: {
    minimize: config.isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { parser: safePostCssParser },
        cssProcessorPluginOptions: {
          preset: ['default', { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            options: {
              cache: true,
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
              resolvePluginsRelativeTo: __dirname,
            },
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: '8',
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          name: '[hash].[ext]',
          limit: 10000,
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                postcssNormalize(),
              ],
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: [path.resolve(__dirname, 'build'), config.staticPath],
    publicPath: '/',
    overlay: true,
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    stats: 'errors-only',
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      inlineSource: '.(js|css)$',
      template: config.htmlPath,
      filename: config.isProduction ? config.htmlName : 'index.html',
    }),
    config.isProduction && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    config.isProduction &&
      new MiniCssExtractPlugin({
        filename: config.cssName,
      }),
  ].filter(Boolean),
};
