/* global  */
const webpack = require('webpack')
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const querystring = require('querystring')
const { removeEmpty } = require('webpack-config-utils')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = env => {
	const context = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.js.src
	)
	const dest = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.js.dest
	)
	const { filename, entries, hot } = TASK_CONFIG.js

	const config = {
		entry: entries,
		cache: true,
		context: context,
		output: {
			path: path.normalize(dest),
			jsonpFunction: 'webpackJsonp',
			publicPath: '/app/themes/wbsl/dist/js/',
			pathinfo: env !== 'production' && true,
			filename:
				env === 'production'
					? `[name].${filename}.${TASK_CONFIG.stamp}.js`
					: `[name].${filename}.js`,
			chunkFilename: '[name].[chunkhash].js'
		},
		resolve: {
			alias: {
				'@': context
			}
		},
		devtool:
			env === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
		module: {
			loaders: [
				{
					test: /\.js?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					query: {
						presets: [
							[
								'env',
								{
									targets: {
										browsers: ['last 2 versions', 'safari >= 7']
									}
								}
							],
							'react'
						],
						plugins: [
							'transform-object-rest-spread',
							'transform-class-properties',
							'syntax-dynamic-import'
						],
						babelrc: false,
						cacheDirectory: false
					}
				},
				{
					test: /\.js$/,
					loader: 'eslint-loader',
					exclude: /node_modules/
				}
			]
		},
		plugins: removeEmpty([
			new ProgressBarPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: env === 'production' ? '"production"' : '"development"'
				}
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'common',
				minChunks: function(module) {
					return module.context && module.context.indexOf('node_modules') !== -1
				}
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				minChunks: Infinity
			})
		])
	}

	if (env === 'development') {
		// Create new entry object with webpack-hot-middleware and react-hot-loader (if enabled)
		if (!hot || hot.enabled !== false) {
			for (let key in entries) {
				const entry = []
				const hotMiddleware = `webpack-hot-middleware/client?${querystring.stringify(
					hot
				)}`

				if (hot.react) {
					entry.push('react-hot-loader/patch')
				}

				entries[key] = entry.concat(hotMiddleware, entries[key])
			}
			config.plugins.push(new webpack.HotModuleReplacementPlugin())
		}
	}

	if (env === 'production') {
		config.plugins.push(
			new UglifyJsPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		)
	}

	return config
}
