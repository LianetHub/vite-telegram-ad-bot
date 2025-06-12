import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


const config = {
	preprocess: vitePreprocess(
		{
			scss: {
				includePaths: ['src'],
				prependData: `@import 'lib/scss/style.scss';`
			}
		}
	),
	kit: { adapter: adapter() },
};

export default config;
