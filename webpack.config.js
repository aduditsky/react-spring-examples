const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const webpack = require('webpack')
const fs = require('fs')

const createAlias = (name, fallback) => (fs.existsSync(name) ? name : fallback)

module.exports = mode => {
  return {
    mode,
    entry: 'index.js',
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve('./dist'),
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        {
          test: /\.tsx?$/,
          use: ['awesome-typescript-loader'],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    loose: true,
                    useBuiltIns: false,
                    targets: { browsers: 'last 2 Chrome versions' },
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/proposal-class-properties', { loose: true }],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      modules: [path.resolve('./'), 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        shared: createAlias(
          path.resolve('../packages/shared/src'),
          '@react-spring/shared'
        ),
        'react-spring$': createAlias(
          path.resolve('../packages/react-spring'),
          '@react-spring/web'
        ),
        react: path.resolve('node_modules/react'),
        'react-dom': path.resolve('node_modules/react-dom'),
        'prop-types': path.resolve('node_modules/prop-types'),
      },
    },
    plugins: [
      new CheckerPlugin(),
      new HtmlWebpackPlugin({ template: 'template.html' }),
    ],
    devServer: {
      hot: false,
      contentBase: path.resolve('./'),
      stats: 'errors-only',
    },
    devtool: 'inline-source-map',
    performance: { hints: false },
  }
}
