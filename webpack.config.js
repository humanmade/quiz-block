const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		'blocks/quiz/index': './src/blocks/quiz/index.js',
		'blocks/question/index': './src/blocks/question/index.js',
		'blocks/question-content/index': './src/blocks/question-content/index.js',
		'blocks/feedback/index': './src/blocks/feedback/index.js',
		'blocks/quiz-complete/index': './src/blocks/quiz-complete/index.js',
	},
};
