const gulp = require('gulp')
const webpack = require('webpack')
const inject = require('gulp-inject')
const { logger } = require('../utils/logs')
const webpackConfig = require('./webpack.config.babel')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const browserSync = require('browser-sync')
const path = require('path')

module.exports = {
	serviceWorker,
	inlineScripts,
	webpackProduction
}

gulp.task('serviceWorker', serviceWorker)
gulp.task('inline-scripts', inlineScripts)
gulp.task('bundle-script', webpackProduction)

function webpackProduction(callback) {
	const config = webpackConfig(global.env)
	webpack(config, function(err, stats) {
		logger(err, stats)
		callback()
	})
}

function inlineScripts() {
	return gulp
		.src(`${PATH_CONFIG.inline.path}/${PATH_CONFIG.inline.output}`)
		.pipe(
			inject(gulp.src(PATH_CONFIG.inline.src).pipe(uglify()), {
				transform: function(filepath, file) {
					return `<script>${file.contents.toString()}</script>`
				}
			})
		)
		.pipe(gulp.dest(PATH_CONFIG.inline.path))
}

function serviceWorker() {
	const STAMP = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''
	return gulp
		.src(path.resolve(PATH_CONFIG.src, PATH_CONFIG.serviceWorker.src, 'sw.js'))
		.pipe(
			babel({
				plugins: [
					[
						'inline-replace-variables',
						{
							__CSS__: `/dist/css/style${STAMP}.css`,
							__JS__: `/dist/js/bundle${STAMP}.js`
						}
					]
				]
			})
		)
		.pipe(gulpif(PRODUCTION, uglify()))
		.pipe(
			gulp.dest(
				path.resolve(
					process.env.PWD,
					PATH_CONFIG.public,
					PATH_CONFIG.serviceWorker.dest
				)
			)
		)
		.pipe(browserSync.stream())
}
