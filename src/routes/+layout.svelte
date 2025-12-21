<script lang="ts">
    import '../app.css';
    import { browser } from '$app/environment';
    import { themeStore } from '$lib/stores/theme';
    import { onMount } from 'svelte';

    export const prerender = true;
    export const ssr = false;
    export const trailingSlash = 'always';

    let { children } = $props();

    onMount(() => {
        if (browser) {
            const html = document.documentElement;
            html.setAttribute('data-theme', themeStore.theme);
            if (themeStore.mode === 'dark') {
                html.classList.remove('light');
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
            }
        }
    });
</script>

{@render children()}