const browserSync = require('browser-sync')
const changed = require('gulp-changed')
const gulp = require('gulp')
const cssnano = require('gulp-cssnano')
const { getPaths } = require('../libs/utils')
const path = require('path')

module.exports = {
	fonts,
	cssFonts,
	favicons,
	moveScripts,
	json,
	staticAssets
}

gulp.task('fonts', fonts)
gulp.task('cssFonts', cssFonts)
gulp.task('favicons', favicons)
gulp.task('move-scripts', moveScripts)
gulp.task('json', json)
gulp.task('staticAssets', staticAssets)

function fonts() {
	const paths = getPaths('fonts')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function favicons() {
	const paths = getPaths('favicons')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function moveScripts() {
	const src = PATH_CONFIG.js.libs.map(lib => {
		return path.resolve(process.env.PWD, lib)
	})

	const dest = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.js.dest
	)

	return gulp
		.src(src)
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}

function json() {
	const paths = getPaths('json')

	return gulp
		.src(paths.entry)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function cssFonts() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.cssFonts.src,
			'*.css'
		),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.cssFonts.dest
		)
	}

	return gulp
		.src(paths.src)
		.pipe(
			cssnano({
				discardUnused: false
			})
		)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function staticAssets() {
	const paths = getPaths('static')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}
