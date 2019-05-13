const {join, resolve} = require('path');

const {
  svgOptions: svgOptimizationOptions,
} = require('@shopify/images/optimize');
const postcssShopify = require('postcss-shopify');
const postcssRemtoPx = require('./config/uxpin/postcss-remtopx');

const ICON_PATH_REGEX = /icons\//;
const IMAGE_PATH_REGEX = /\.(jpe?g|png|gif|svg)$/;

const cacheDir = resolve(__dirname, '../build/cache/uxpin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: `${cacheDir}/babel`,
              babelrc: false,
              presets: [
                [
                  'babel-preset-shopify/web',
                  {modules: false, typescript: true},
                ],
                ['babel-preset-shopify/react', {hot: false}],
              ],
              plugins: [
                `${__dirname}/config/uxpin/babel-rewrite-theme-provider.js`,
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              sourceMap: false,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [postcssRemtoPx(), postcssShopify()],
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              includePaths: [resolve(__dirname, '..', 'src', 'styles')],
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                resolve(__dirname, 'src', 'styles', 'foundation.scss'),
                resolve(__dirname, 'src', 'styles', 'shared.scss'),
              ],
            },
          },
        ],
      },
      {
        test(resource) {
          return ICON_PATH_REGEX.test(resource) && resource.endsWith('.svg');
        },
        use: [
          {
            loader: '@shopify/images/icon-loader',
          },
          {
            loader: 'image-webpack-loader',
            options: {
              svgo: svgOptimizationOptions(),
            },
          },
        ],
      },
      {
        test(resource) {
          return (
            IMAGE_PATH_REGEX.test(resource) && !ICON_PATH_REGEX.test(resource)
          );
        },
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@shopify/polaris': resolve(__dirname, 'src'),
    },
  },
};
