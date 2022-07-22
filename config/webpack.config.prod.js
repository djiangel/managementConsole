'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = true;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[hash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

const postCSSLoaderOptions = {
  // Necessary for external CSS imports to work
  // https://github.com/facebook/create-react-app/issues/2677
  ident: 'postcss',
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      flexbox: 'no-2009'
    })
  ],
  sourceMap: shouldUseSourceMap
};

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: postCSSLoaderOptions
    }
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap
      }
    });
  }
  return ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: {
          loader: require.resolve('style-loader'),
          options: {
            hmr: false
          }
        },
        use: loaders
      },
      extractTextPluginOptions
    )
  );
};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  mode: 'production',
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  // devtool: 'cheap-module-source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: '[name].[hash].bundle.js',
    chunkFilename: 'static/js/[name].[hash].chunk.js',
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  resolve: {
    modules: ['node_modules'].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: [
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.ts',
      '.tsx'
    ],
    alias: {
      actions: path.resolve(__dirname, '../src/actions'),
      components: path.resolve(__dirname, '../src/components'),
      constants: path.resolve(__dirname, '../src/constants'),
      containers: path.resolve(__dirname, '../src/containers'),
      consumers: path.resolve(__dirname, '../src/consumers'),
      '@graphql': path.resolve(__dirname, '../src/graphql'),
      reducers: path.resolve(__dirname, '../src/reducers'),
      sagas: path.resolve(__dirname, '../src/sagas'),
      selectors: path.resolve(__dirname, '../src/selectors'),
      store: path.resolve(__dirname, '../src/store'),
      utils: path.resolve(__dirname, '../src/utils'),
      'react-native': 'react-native-web'
    }
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [require.resolve('babel-preset-react-app')],
                  compact: true,
                  highlightCode: true
                }
              }
            ]
          },
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('awesome-typescript-loader')
              }
            ]
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap
            })
          },
          {
            test: cssRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                minimize: true,
                sourceMap: shouldUseSourceMap
              },
              'sass-loader'
            )
          },
          {
            test: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                minimize: true,
                sourceMap: shouldUseSourceMap,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent
              },
              'sass-loader'
            )
          },
          {
            test: /\.(graphql)$/,
            loader: 'graphql-tag/loader'
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true
    // minimizer: [
    //   // new TerserPlugin({
    //   //   sourceMap: false,
    //   //   terserOptions: {
    //   //     compress: false,
    //   //     comparisons: false,
    //   //     mangle: false,
    //   //     sourceMap: false,
    //   //     warnings: false
    //   //   },
    //   //   parallel: false
    //   //   // parallel: true
    //   // })
    //   new BabelMinifyPlugin({}, {
    //     sourceMap: false
    //   })
    // ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        // minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new webpack.DefinePlugin(env.stringified),
    new ExtractTextPlugin({
      filename: cssFilename
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: publicPath
    }),
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebook/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new TerserPlugin({
    //   sourceMap: false,
    //   terserOptions: {
    //     compress: {

    //     },
    //     mangle: true
    //   }
    // }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
