const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const merge = require('merge-stream')
const { handleErrors } = require('../libs/utils')

function initConfig(cb) {
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
	return gulp
		.src(['src/**/*', '*.gitkeep'])
		.pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)))
}

gulp.task('init:config', initConfig)
gulp.task('init:files', scaffoldProject)
gulp.task('init', ['init:config', 'init:files'])
