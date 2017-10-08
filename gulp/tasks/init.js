const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const fs = require('fs')
const merge = require('merge-stream')
const { handleErrors } = require('../libs/utils')

function initConfig(cb) {
	if (fs.existsSync('config')) {
		console.info('config folder already exists, skipping init:config task')
		return
	}

	return gulp
		.src([
			'gulp/path.config.json',
			'gulp/path.config.cms.json',
			'gulp/path.config.fractal.json',
			'gulp/task.config.js'
		])
		.pipe(gulp.dest(path.join(process.env.PWD, 'config')))
}

function scaffoldProject(cb) {
	if (fs.existsSync('src')) {
		console.info('src folder already exists, skipping init:files task')
		return
	}

	return gulp
		.src(['src/**/*', '*.gitkeep'])
		.pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)))
}

gulp.task('init:config', initConfig)
gulp.task('init:files', scaffoldProject)
gulp.task('init', ['init:config', 'init:files'])
