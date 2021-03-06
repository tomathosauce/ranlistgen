const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins:[
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
    }),
  ]
};