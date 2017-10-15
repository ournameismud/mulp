const fs = require('fs')
const path = require('path')
const faker = require('faker')
const fractal = require('@frctl/fractal').create()

module.exports = {
	fractal,
	exportPaths
}

const paths = {
	src: PATH_CONFIG.src,
	library: PATH_CONFIG.fractal.library,
	tmp: PATH_CONFIG.fractal.tmp
}

const stamp = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''

const mandelbrot = require('@frctl/mandelbrot')({
	favicon: '/favicon.ico',
	lang: 'en-gb',
	styles: ['default', `/dist/css/theme${stamp}.css`],
	static: {
		mount: 'fractal'
	}
})

const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
	html: true,
	xhtmlOut: true,
	typographer: true
})
	.use(mdAbbr)
	.use(mdFootnote)

function _titleCase(str) {
	return str
		.toLowerCase()
		.split(' ')
		.map(function(word) {
			return word.charAt(0).toUpperCase() + word.slice(1)
		})
		.join(' ')
}

const twigConf = {
	filters: {
		markdown(str) {
			return md.render(str)
		},
		markdownInline(str) {
			return md.renderInline(str)
		},
		slugify(str) {
			return str.toLowerCase().replace(/[^\w]+/g, '')
		},
		stringify() {
			return JSON.stringify(this, null, '\t')
		},
		title(str, num = 3) {
			if (str) return str
			return _titleCase(faker.lorem.words(num))
		},
		lorem(str, num = 10) {
			if (str) return str
			return faker.lorem.words(num)
		},
		sentence(str, num = 10) {
			if (str) return str
			return faker.lorem.sentence(num)
		},
		para(str, num = 2) {
			if (str) return str
			return faker.lorem.paragraphs(num, '\n\n')
		},
		titleCase(str) {
			return _titleCase(str)
		},
		img(str, size = '800x600') {
			if (str) return
			return `https://source.unsplash.com/random/${size}`
		}
	},
	functions: {
		getStamp() {
			return {
				stamp
			}
		}
	}
}

const nunjucks = require('@frctl/nunjucks')({
	filters: {
		markdown(str) {
			return md.render(str)
		},
		markdownInline(str) {
			return md.renderInline(str)
		},
		key(str, key) {
			return str[key]
		},
		slugify(str) {
			return str.toLowerCase().replace(/[^\w]+/g, '')
		},
		stringify() {
			return JSON.stringify(this, null, '\t')
		},
		first(str) {
			return str[0]
		},
		collection(val) {
			return Array(val).fill(0)
		},
		limit(array, count) {
			return array.slice(0, count)
		}
	},
	globals: {
		title: TASK_CONFIG.title
	},
	paths: [`${paths.static}/dist/images`]
})

const twigAdapter = require('@frctl/twig')(twigConf)
// Project config
fractal.set('project.title', TASK_CONFIG.title)

// Components config

fractal.components.engine(twigAdapter)
fractal.components.set('default.preview', '@layout')
fractal.components.set('default.status', 'wip')
fractal.components.set('default.collated', false)
fractal.components.set('ext', '.twig')
fractal.components.set(
	'path',
	path.resolve(process.env.PWD, paths.src, 'templates')
)
fractal.components.set(
	'layout',
	path.resolve(process.env.PWD, paths.src, 'wrapper/_layout.twig')
)
fractal.components.set('default.context', TASK_CONFIG.fractal.context)
fractal.components.set('statuses', TASK_CONFIG.fractal.statuses)

// Docs config
fractal.docs.engine(nunjucks)
fractal.docs.set('ext', '.md')
fractal.docs.set('path', path.resolve(process.env.PWD, paths.src, 'docs'))

// Web UI config
fractal.web.theme(mandelbrot)
fractal.web.set('static.path', path.resolve(process.env.PWD, paths.tmp))
fractal.web.set('builder.dest', path.resolve(process.env.PWD, paths.library))
fractal.web.set('builder.urls.ext', '.html')

// https://clearleft.com/posts/443
function exportPaths() {
	return new Promise((resolve, reject) => {
		const map = {}
		for (let item of fractal.components.flattenDeep()) {
			const file = item.handle.includes('--default')
				? item.handle.split('--default')[0]
				: item.handle

			const dest = path
				.resolve(process.env.PWD, item.viewDir)
				.split('templates/')[1]

			map[`@${file}`] = {
				src: path.resolve(process.env.PWD, item.viewPath),
				dest: `fractal/${dest}`,
				file: `${file}.twig`
			}
		}

		fs.writeFile(
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.craftTemplates.config,
				'components-map.json'
			),
			JSON.stringify(map, null, 2),
			'utf8',
			err => {
				if (err) {
					reject(err)
					return
				}
				resolve(map)
			}
		)
	})
}

fractal.components.on('updated', exportPaths)
