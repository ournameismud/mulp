const { getPathConfig, getTaskConfig } = require('./gulp/libs/utils')
const requireDir = require('require-dir')
const util = require('gulp-util')
const path = require('path')
const PATH_CONFIG = getPathConfig()
const TASK_CONFIG = getTaskConfig()

// Fallback for windows backs out of node_modules folder to root of project
process.env.PWD = process.env.PWD || __dirname

const { env } = util.env
let PATHS = PATH_CONFIG

if (util.env.config) {
	try {
		const PATH_OVERWRITES = require(path.resolve(
			process.env.PWD,
			`config/path.config.${util.env.config}.json`
		))
		PATHS = { ...PATH_CONFIG, ...PATH_OVERWRITES }
	} catch (e) {
		throw new Error(
			`config/path.config.${util.env
				.config}.json can not be found, ${e.name}: ${e.message}`
		)
	}
}

global.env = env ? env : 'development'
global.PRODUCTION = global.env === 'production'
global.PATH_CONFIG = PATHS
global.SERVER = PATHS.browserSync
global.TASK_CONFIG = TASK_CONFIG
global.BUILD_TYPE = util.env.config
global.log = util.log

log(
	` 
	                 __        
	.--------.--.--.|  |.-----.
	|        |  |  ||  ||  _  |
	|__|__|__|_____||__||   __|
                            |__|
	
	ENV: ${global.env}, CONFIG: ${util.env.config
		? util.env.config
		: 'development'}`
)

requireDir('./gulp/tasks', {
	recurse: true
})
