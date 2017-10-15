const { scss } = require('./scss')
const { images } = require('./images')
const { svgs } = require('./svgs')
const { symbols } = require('./symbols')
const { fontsTask, faviconsTask, json, cssFonts, fonts } = require('./assets')
const { tokens } = require('./tokens')
const { serviceWorker } = require('./scripts')
const { twig } = require('./twig')

module.exports = {
	scss,
	images,
	svgs,
	symbols,
	fontsTask,
	faviconsTask,
	json,
	cssFonts,
	fonts,
	tokens,
	serviceWorker,
	twig
}
