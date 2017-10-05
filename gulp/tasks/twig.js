const gulp = require('gulp')
const changed = require('gulp-changed')
const path = require('path')
const browserSync = require('browser-sync')
const gulpSequence = require('gulp-sequence')

module.exports = {
	twigTemplates,
	twig
}

gulp.task('updateTwigTemplates', updateTwigTemplates)
gulp.task('twig', twig)
gulp.task('build:twig', buildTwig)

function twigTemplates(resp) {
	for (const key in resp) {
		const { src, dest } = resp[key]
		const d = path.resolve(
			process.env.PWD,
			PATH_CONFIG.craftTemplates.dest,
			dest
		)
		gulp
			.src(path.resolve(process.env.PWD, src))
			.pipe(changed(d))
			.pipe(gulp.dest(d))
			.pipe(browserSync.stream())
	}
}

function updateTwigTemplates() {
	const json = path.resolve(
		process.env.PWD,
		PATH_CONFIG.craftTemplates.config,
		'components-map.json'
	)

	twigTemplates(require(json))
}

function buildTwig(cb) {
	return gulpSequence('updateTwigTemplates', 'critical', 'cacheBuster', cb)
}

function twig() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.twig.src,
			'**/**/*.twig'
		),
		dest: path.resolve(process.env.PWD, PATH_CONFIG.twig.dest)
	}

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}
