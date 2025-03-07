const path = require('path');
const fs = require('fs');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'aframe-gif-shader.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'AFRAME_GIF',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    aframe: 'AFRAME'
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
      publicPath: '/'
    },
    hot: true,
    open: '/examples/basic/index.html',
    port: 8080,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
      }
    },
    devMiddleware: {
      publicPath: '/dist/'
    },
    allowedHosts: 'all',
    client: {
      overlay: true,
      progress: true
    }
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000
  },
  mode: 'development',
  devtool: 'source-map'
};