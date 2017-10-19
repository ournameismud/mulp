import path from 'path'
import fs from 'path'

export function exportPaths(fractal) {
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
