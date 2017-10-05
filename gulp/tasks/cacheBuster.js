const gulp = require('gulp')
const htmlreplace = require('gulp-html-replace')

module.exports = {
	cacheBusterTask
}

gulp.task('cacheBuster', cacheBusterTask)

function cacheBusterTask() {
	if (!PATH_CONFIG.tags) return

	const cms = '{% set stamp = "%s" %}'

	const production = {
		cms: {
			src: `.${TASK_CONFIG.stamp}`,
			tpl: cms
		}
	}

	const development = {
		cms: {
			src: '',
			tpl: cms
		}
	}

	const files = global.env === 'production' ? production : development

	return gulp
		.src(PATH_CONFIG.tags.src)
		.pipe(
			htmlreplace(files, {
				keepBlockTags: true
			})
		)
		.pipe(gulp.dest(PATH_CONFIG.tags.dest))
}
