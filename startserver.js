const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config/webpack.config.dev.js');
const clientCompiler = webpack(config);

const server = new WebpackDevServer(clientCompiler, {
  disableHostCheck: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  inline: true,
  clientLogLevel: 'info',
  contentBase: 'src',
  watchContentBase: true,
  quiet: false,
  noInfo: false,
  // stats: {
  //   colors: true,
  //   chunks: false,
  //   'errors-only': true
  // },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  proxy: {
    '/graphql': {
      target: 'http://127.0.0.1:8081/'
    },
    '/iam/*': {
      target: 'http://127.0.0.1:8081/',
      changeOrigin: true
    }
  }
});

server.listen(8080, '0.0.0.0');
console.log('Webpack development server started on port 8080');
