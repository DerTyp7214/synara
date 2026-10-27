<script lang="ts">
    import '../app.css';
    import { page } from '$app/state';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { children } = $props();

    let bare = $derived(page.url.pathname.startsWith('/share'));
</script>

<svelte:head>
    <title>Synara</title>
</svelte:head>

{#if bare}
    {@render children()}
{:else}
    <a href="#main" class="key key-primary key-sm fixed top-3 left-3 z-[60] -translate-y-20 focus:translate-y-0">Skip to content</a>
    <div class="flex min-h-dvh flex-col">
        <Header/>
        <main id="main" class="flex-1">
            {@render children()}
        </main>
        <Footer/>
    </div>
{/if}
