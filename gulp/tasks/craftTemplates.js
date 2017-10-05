const browserSync = require('browser-sync')
const gulp = require('gulp')
const { getPaths } = require('../libs/utils')

module.exports = {
	craftTemplates
}

gulp.task('craftTemplates', craftTemplates)

function craftTemplates() {
	const paths = getPaths('craftTemplates')

	return gulp.src(paths.src).pipe(browserSync.stream())
}
