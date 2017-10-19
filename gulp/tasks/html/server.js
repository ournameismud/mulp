const webpack = require('webpack')
const webpackConfig = require('../webpack.config.babel')
const { pathToUrl } = require('../../libs/utils')
const path = require('path')
const browserSync = require('browser-sync')

module.exports = {
	devServer
}

function devServer() {
	const config = webpackConfig(global.env)
	const compiler = webpack(config)
	const proxyConfig = SERVER.proxy || null

	if (typeof proxyConfig === 'string') {
		SERVER.proxy = {
			target: proxyConfig
		}
	}
	// Resolve path from PWD
	if (SERVER.server && SERVER.server.baseDir) {
		SERVER.server.baseDir = path.resolve(process.env.PWD, SERVER.server.baseDir)
	}

	// Resolve files from PWD
	if (SERVER.files) {
		SERVER.files = SERVER.files.map(function(glob) {
			return path.resolve(process.env.PWD, glob)
		})
	}

	const server = SERVER.proxy || SERVER.server

	server.middleware = [
		require('webpack-dev-middleware')(compiler, {
			stats: 'errors-only',
			publicPath: pathToUrl('/', config.output.publicPath)
		}),
		require('webpack-hot-middleware')(compiler)
	]

	browserSync.init({
		...SERVER,
		...TASK_CONFIG.server
	})
}
