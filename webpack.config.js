const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const postcssNormalize = require('postcss-normalize');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

const projectPath = './project/dynamic-busan/src/sample/page-slider';
const projectJs = `${projectPath}/script.js`;
const projectHtml = `${projectPath}/index.html`;

module.exports = {
  mode,
  entry: projectJs,
  output: {
    filename: 'script.js',
    path: path.resolve(`${__dirname}/build`),
  },
  optimization: {
    minimize: isProduction,
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
        options: { presets: ['@babel/preset-env'] },
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
    contentBase: 'index.html',
    publicPath: '/',
    overlay: true,
    host: 'localhost',
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      inlineSource: '.(js|css)$',
      template: projectHtml,
      filename: 'index.html',
      stats: 'errors-only',
    }),
    isProduction && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
  ].filter(Boolean),
};
