// import { defineConfig } from 'vite';
// import eslint from 'vite-plugin-eslint';

// export default defineConfig({
// 	plugins: [eslint()],
// });
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import babel from 'vite-plugin-babel';

export default defineConfig({
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
});
