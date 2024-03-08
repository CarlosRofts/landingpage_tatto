module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: 'airbnb-base',
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
		'no-new': 'off',
		'no-param-reassign': 'off',
		'no-console': 'off',
		'linebreak-style': ['warn', 'unix'],
		'no-restricted-syntax': [
			'warn',
			{
				selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
				message: 'Unexpected property on console object was called',
			},
		],
		indent: ['warn', 2, { SwitchCase: 1 }],
		quotes: ['warn', 'single'],
		semi: ['warn', 'always'],
		'no-unused-vars': 'off', // Desactiva la regla 'no-unused-vars'
		'max-len': 'off', // Cambia 'error' a 'warn'
		'no-debugger': 'warn',
	},
};
