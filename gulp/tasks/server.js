const browserSync = require('browser-sync')
const gulp = require('gulp')
const { fractalServer } = require('./fractal/server')
const { devServer } = require('./html/server')

gulp.task('server:fractal', fractalServer)
gulp.task('server:cms', devServer)

gulp.task('server', () => {
	browserSync.init({
		...SERVER,
		...TASK_CONFIG.server
	})
})
