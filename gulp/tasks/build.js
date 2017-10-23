const gulp = require('gulp')
const sizereport = require('gulp-sizereport')
const gulpSequence = require('gulp-sequence')
// const rename = require('gulp-rename')
// const gulpif = require('gulp-if')
// const htmlmin = require('gulp-htmlmin')
const util = require('gulp-util')
const path = require('path')
const { getTasks } = require('../utils/tasks')
const { buildFractal } = require('./fractal/build')
const { fractalTemplates } = require('./fractal/utils')
const del = require('del')

module.exports = {
	buildCode
}

function build(cb) {
	if (TASK_CONFIG.mode === 'fractal') {
		if (util.env.config === 'cms') {
			buildCode(cb)
				.then(() => {
					return fractalTemplates()
				})
				.then(() => {
					console.log('All done')
				})
		} else {
			buildFractal().then(() => {
				buildCode(cb)
			})
		}
	} else {
		buildCode(cb)
	}
}

function buildCode(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	codeTasks.push('bundle-script')

	return new Promise(resolve => {
		gulpSequence(
			'clean:dist',
			assetTasks,
			codeTasks,
			'cacheBuster',
			'size-report',
			resolve
		)
	})
}

gulp.task('build', build)

gulp.task('clean:dist', () => {
	return del(
		[path.resolve(process.env.PWD, PATH_CONFIG.public, PATH_CONFIG.dist)],
		{
			force: true
		}
	)
})

gulp.task('size-report', function() {
	return gulp
		.src([
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.public,
				PATH_CONFIG.dist,
				'**/*.css'
			),
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.public,
				PATH_CONFIG.dist,
				'**/*.js'
			),
			'*!rev-manifest.json'
		])
		.pipe(
			sizereport({
				gzip: true
			})
		)
})
