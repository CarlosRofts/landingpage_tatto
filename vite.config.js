import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import babel from 'vite-plugin-babel';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';
// import dotenv from 'dotenv';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		base: '/landingpage_tatto/', // // ⛔ githubpages
		// base: './', // ⛔ local
		root: 'src/',
		publicDir: '../public/',
		// assetsInclude: ['**/*.glsl'],

		plugins: [
			glsl({
				include: [
					// Glob pattern, or array of glob patterns to import
					'**/*.glsl',
					'**/*.wgsl',
					'**/*.vert',
					'**/*.frag',
					'**/*.vs',
					'**/*.fs',
				],
				// defaultExtension: 'glsl', // Shader suffix when no extension is specified
				// compress: false, // Compress output shader code
				// watch: true, // Recompile shader on change
				// root: 'src/', // Directory for root imports
			}),
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
			// glsl(),
		],
		build: {
			target: 'es2015',
			polyfillDynamicImport: false,
			outDir: '../dist',
			assetsDir: '',
			sourcemap: true,
			minify: 'terser',
			rollupOptions: {
				external: [],
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return 'vendor';
						}
					},
				},
				input: {
					main: resolve(__dirname, 'src/index.html'),
					nested: resolve(__dirname, 'src/pages/gallery.html'),
				},
			},
		},

		define: {
			'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
			'process.env.API_URL': JSON.stringify(env.API_URL),
			'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
			// If you want to exposes all env variables, which is not recommended
			// 'process.env': env
		},
	};
});
