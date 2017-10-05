const gulp = require('gulp')
const critical = require('critical')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const htmlreplace = require('gulp-html-replace')
const path = require('path')

module.exports = {
	critialCss
}

gulp.task('critical', critialCss)

function critialCss() {
	const { paths, templates, urlBase, outputBase } = PATH_CONFIG.critical

	paths.map(({ input, output }) => {
		const { url, source } = input
		const { name, dist } = output
		critical
			.generate({
				base: path.resolve(process.env.PWD, urlBase),
				src: url,
				...TASK_CONFIG.critical
			})
			.then(output => {
				gulp
					.src(path.resolve(process.env.PWD, templates, source))
					.pipe(
						htmlreplace(
							{
								critical: {
									src: null,
									tpl: `<style>${output}</style>`
								}
							},
							{
								keepBlockTags: true
							}
						)
					)
					.pipe(
						gulpif(
							typeof name !== 'undefined',
							rename({
								basename: name
							})
						)
					)
					.pipe(gulp.dest(path.resolve(process.env.PWD, outputBase, dist)))
			})
			.catch(err => console.log(err))
	})
}
