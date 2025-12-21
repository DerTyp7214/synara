<script lang="ts">
    import '../../app.css';
    import { AppBar } from '@skeletonlabs/skeleton-svelte';
    import { page } from '$app/state';
    import LogoLong from "$lib/components/Logo_LONG.svelte";
    import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
    import { fly, fade } from 'svelte/transition';
    import Logo from "$lib/components/Logo.svelte";
    import Logo_TEXT from "$lib/components/Logo_TEXT.svelte";

    let { children } = $props();
    let isDrawerOpen = $state(false);

    const navLinks = [
        {href: '/', label: 'Home'},
        {href: '/features', label: 'Features'},
        {href: '/docs', label: 'Docs'},
        {href: '/changelog', label: 'Changelog'},
        {href: '/faq', label: 'FAQ'},
        {href: '/about', label: 'About'},
        {href: '/pricing', label: 'Pricing'}
    ];

    function getActiveClass(href: string) {
        return page.url.pathname === href ? 'bg-primary-500/20 text-primary-500 font-bold' : '';
    }
</script>

{#if isDrawerOpen}
    <div 
        class="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" 
        onclick={() => isDrawerOpen = false}
        onkeydown={(e) => e.key === 'Escape' && (isDrawerOpen = false)}
        role="button"
        tabindex="-1"
        aria-label="Close menu"
        transition:fade={{ duration: 200 }}
    ></div>
    
    <div 
        class="fixed left-0 top-0 h-screen w-[280px] bg-surface-50-900-token border-r border-surface-200-800 shadow-2xl overflow-y-auto z-50 p-4 space-y-4"
        transition:fly={{ x: -300, duration: 200 }}
    >
        <h2 class="h2 font-bold bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">
            <LogoLong class="inline h-8 w-auto mr-2"/>
        </h2>
        <hr class="opacity-50"/>
        <nav class="list-nav">
            <ul>
                {#each navLinks as link}
                    <li>
                        <a href={link.href} class={getActiveClass(link.href)} onclick={() => isDrawerOpen = false}
                           title="{link.label}">
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
{/if}

<div class="min-h-screen w-full flex flex-col bg-surface-50-900-token text-surface-900-50-token transition-colors duration-200">

    <header class="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-surface-900/70 backdrop-blur-md transition-colors duration-200">

        <AppBar class="!bg-transparent p-4">

            <div class="flex items-center justify-between w-full">

                <div class="flex items-center gap-4">
                    <button class="btn-icon btn-icon-sm md:hidden" onclick={() => isDrawerOpen = true} aria-label="Open Menu">
                        <span>
                            <svg viewBox="0 0 100 80" width="20" height="20" fill="currentColor">
                                <rect width="100" height="15"></rect>
                                <rect y="30" width="100" height="15"></rect>
                                <rect y="60" width="100" height="15"></rect>
                            </svg>
                        </span>
                    </button>
                    <a href="/" class="text-2xl font-bold uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center gap-3
                     text-surface-950-50 ms-4">
                        <LogoLong class="h-8 w-auto"/>
                    </a>
                </div>

                <div class="hidden md:flex justify-center gap-1">
                    {#each navLinks as link}
                        <a href={link.href} class="btn btn-sm hover:preset-tonal-primary {getActiveClass(link.href)}">
                            {link.label}
                        </a>
                    {/each}
                </div>

                <div class="flex items-center gap-2">
                    <ThemeSwitcher />
                    <a href="/docs" class="btn preset-filled-primary-500 font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all leading-tight pt-1.5 px-4 pb-2.5">
                        Get Synara
                    </a>
                </div>

            </div>
        </AppBar>
    </header>


    <div class="flex-1 w-full pt-24 relative z-0">
        <div class="w-full min-h-screen relative bg-surface-50-950 transition-colors duration-200">
            {@render children()}
        </div>
    </div>

    <footer class="bg-surface-100-900 text-surface-700-300 py-16 border-t border-surface-200-800 transition-colors duration-200 relative z-0">
        <div class="container mx-auto px-8 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0">
            <div class="lg:w-1/2 lg:pr-24 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                <a href="/" class="text-2xl font-bold uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center gap-4
                     text-surface-950-50">
                    <LogoLong class="h-8 w-auto"/>
                </a>
                <p class="opacity-80 leading-relaxed">
                    The all-rounder music player tailored for your local library and streaming needs.
                    Open Source and free forever.
                </p>
            </div>
            <div class="flex-1 w-full grid grid-cols-3 gap-8 lg:gap-12">
                <div class="space-y-4">
                    <h4 class="h5 font-bold uppercase tracking-wider text-surface-950-50 text-center lg:text-start">Product</h4>
                    <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                        <a href="/features" class="hover:text-primary-500 transition-colors">Features</a>
                        <a href="/pricing" class="hover:text-primary-500 transition-colors">Pricing</a>
                        <a href="/changelog" class="hover:text-primary-500 transition-colors">Changelog</a>
                        <a href="/docs" class="hover:text-primary-500 transition-colors">Documentation</a>
                    </nav>
                </div>
                <div class="space-y-4">
                    <h4 class="h5 font-bold uppercase tracking-wider text-surface-950-50 text-center lg:text-start">Community</h4>
                    <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                        <a href="https://github.com/dertyp7214/synara" target="_blank" class="hover:text-primary-500 transition-colors">GitHub</a>
                        <a href="#" class="hover:text-primary-500 transition-colors">Discord</a>
                        <a href="#" class="hover:text-primary-500 transition-colors">Twitter / X</a>
                        <a href="/faq" class="hover:text-primary-500 transition-colors">FAQ</a>
                    </nav>
                </div>
                <div class="space-y-4">
                    <h4 class="h5 font-bold uppercase tracking-wider text-surface-950-50 text-center lg:text-start">Legal</h4>
                    <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                        <a href="/imprint" class="hover:text-primary-500 transition-colors">Imprint</a>
                        <a href="/privacy" class="hover:text-primary-500 transition-colors">Privacy Policy</a>
                        <a href="/terms" class="hover:text-primary-500 transition-colors">Terms of Service</a>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container mx-auto px-8 mt-10 pt-8 border-t border-surface-200-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <p>© {new Date().getFullYear()} Synara Project. All rights reserved.</p>
            <p>Made with <span class="text-error-500 animate-pulse">♥</span> by the Community.</p>
        </div>
    </footer>
</div>