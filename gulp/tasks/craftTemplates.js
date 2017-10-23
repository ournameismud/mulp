const gulp = require('gulp')
// const changed = require('gulp-changed')
// const path = require('path')
const browserSync = require('browser-sync')
const { getPaths } = require('../utils/paths')
const { fractalTemplates } = require('./fractal/utils')

module.exports = {
	craftTemplates
}

gulp.task('craftTemplates', craftTemplates)

function craftTemplates(cb) {
	if (TASK_CONFIG.mode === 'fractal') {
		return fractalTemplates().then(() => {
			browserSync.reload()
		})
	} else {
		const paths = getPaths('craftTemplates')

		return gulp.src(paths.src).pipe(browserSync.stream())
	}
}
