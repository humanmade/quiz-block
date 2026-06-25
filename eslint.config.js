// Extends the default wp-scripts ESLint config.
// All @wordpress/* packages are WordPress runtime externals, not npm deps.
const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	...defaultConfig,
	{
		rules: {
			'import/no-unresolved': [ 'error', { ignore: [ '^@wordpress/' ] } ],
			// All @wordpress/* packages are WordPress runtime externals and are
			// never installed as npm deps in a plugin — rule creates false positives.
			'import/no-extraneous-dependencies': 'off',
		},
	},
];
