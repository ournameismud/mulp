import path from 'path'

export function pathFromBase() {
	return path.resolve(process.env.PWD, [...arguments].join(','))
}
