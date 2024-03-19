import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import babel from 'vite-plugin-babel';
import glsl from 'vite-plugin-glsl';
// import dotenv from 'dotenv';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		root: 'src/',
		publicDir: '../public/',
		base: './',
		plugins: [
			eslintPlugin({
				cache: true,
				fix: true,
				include: ['src/**/*.js'],
				exclude: ['node_modules', 'dist'],
				extensions: ['.js'],
				formatter: 'codeframe',
			}),
			babel({
				babelConfig: {
					babelrc: false,
					configFile: false,
					// plugins: ['@babel/plugin-proposal-decorators'],
				},
			}),
			glsl(),
		],
		build: {
			target: 'es2015',
			polyfillDynamicImport: false,
			outDir: 'dist',
			assetsDir: '',
			minify: 'terser',
			sourcemap: true,
			rollupOptions: {
				external: [],
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return 'vendor';
						}
					},
				},
			},
		},
		// define: {
		// 	'process.env': JSON.stringify(dotenv.config().parsed),
		// },
		define: {
			'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
			'process.env.API_URL': JSON.stringify(env.API_URL),
			'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
			// If you want to exposes all env variables, which is not recommended
			// 'process.env': env
		},
	};
});
