const gulp = require('gulp')
const browserSync = require('browser-sync')
const { getPaths } = require('../utils/paths')
const { fractalTemplates } = require('./fractal/utils')

module.exports = {
	cms
}

gulp.task('cms', cms)

function cms(cb) {
	if (TASK_CONFIG.mode === 'fractal') {
		return fractalTemplates().then(() => {
			browserSync.reload()
		})
	} else {
		const paths = getPaths('cms')

		return gulp.src(paths.src).pipe(browserSync.stream())
	}
}
