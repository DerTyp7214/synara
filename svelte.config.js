import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	extensions: ['.svelte'],
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
	}
};

export default config;
