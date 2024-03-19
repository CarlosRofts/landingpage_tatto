module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: 'eslint:recommended',
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'linebreak-style': ['warn', 'unix'],
		indent: ['warn', 2, { SwitchCase: 1 }],
		quotes: ['warn', 'single'],
		semi: ['warn', 'always'],
		'no-unused-vars': 'off', // Desactiva la regla 'no-unused-vars'
		'max-len': 'off', // Cambia 'error' a 'warn'
		'no-debugger': 'warn',
	},
};
