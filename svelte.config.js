import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from "@sveltejs/adapter-static";

export default {
	preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        paths: {
            base: process.env.NODE_ENV === '' ? '/synara' : '',
        }
    }
};
