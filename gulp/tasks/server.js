const browserSync = require('browser-sync')
const gulp = require('gulp')

gulp.task('server', () => {
	browserSync.init({
		...SERVER,
		...TASK_CONFIG.server
	})
})
