export default {
	task: 'code',
	watch: true,
	dataFile: 'data/global.json',
	extensions: ['twig', 'html', 'json'],
	excludeFolders: [
		'layout',
		'macros',
		'data',
		'partials',
		'modules',
		'wrapper',
		'includes'
	]
}
