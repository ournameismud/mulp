const { fractal } = require('./fractal')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.babel')
const { pathToUrl } = require('../libs/utils')
const path = require('path')

module.exports = {
	fractalServer
}

function fractalServer() {
	const config = webpackConfig(global.env)
	const compiler = webpack(config)
	const logger = fractal.cli.console

	fractal.web.set('server.syncOptions', {
		baseDir: path.resolve(process.env.PWD, SERVER.server.baseDir),
		middleware: [
			require('webpack-dev-middleware')(compiler, {
				stats: 'errors-only',
				publicPath: pathToUrl('/', config.output.publicPath)
			}),
			require('webpack-hot-middleware')(compiler)
		],
		watch: true,
		logFileChanges: true,
		watchOptions: {
			ignoreInitial: true,
			ignored: ['**/*.js', '**/*.scss', '!**/*.config.js', '**/*.json']
		},
		files: [
			{
				options: {
					ignored: '**/*.hot-update.json'
				}
			}
		],
		...TASK_CONFIG.server
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
	})
}
