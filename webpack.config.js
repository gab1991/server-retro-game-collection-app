/* eslint-disable node/no-unpublished-require */
const path = require('path');
const TsconfigPATHSPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './server.ts',
  target: 'node',
  externalsPresets: { node: true },
  externals: [nodeExternals()], // block node internal compiling
  output: {
    publicPath: '/',
    filename: 'server.js',
    path: path.resolve(process.cwd(), 'dist'),
    clean: true, // Clean the output directory before emit.
  },
  node: {
    __dirname: true, // remap dirname to source files dirname
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPATHSPlugin(), // ts aliases
    ],
  },
};
