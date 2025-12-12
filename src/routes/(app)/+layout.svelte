<script lang="ts">
    import '../../app.pcss';
    import {AppShell, AppBar, Drawer, getDrawerStore} from '@skeletonlabs/skeleton';
    import {initializeStores} from '@skeletonlabs/skeleton';
    import {page} from '$app/state';
    import Logo from "$lib/components/Logo.svelte";

    initializeStores();
    const drawerStore = getDrawerStore();

    const navLinks = [
        {href: '/', label: 'Home'},
        {href: '/features', label: 'Features'},
        {href: '/docs', label: 'Docs'},
        {href: '/changelog', label: 'Changelog'},
        {href: '/faq', label: 'FAQ'},
        {href: '/about', label: 'About'},
        {href: '/pricing', label: 'Pricing'}
    ];

    function drawerOpen(): void { drawerStore.open({}); }
    function drawerClose(): void { drawerStore.close(); }

    function getActiveClass(href: string) {
        return page.url.pathname === href ? 'bg-primary-500/20 text-primary-500 font-bold' : '';
    }
</script>

<Drawer>
    <div class="p-4 space-y-4">
        <h2 class="h2 font-bold bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">
            <Logo class="inline h-8 w-auto mr-2"/>
        </h2>
        <hr class="opacity-50"/>
        <nav class="list-nav">
            <ul>
                {#each navLinks as link}
                    <li>
                        <a href={link.href} class={getActiveClass(link.href)} on:click={drawerClose}>
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-0" slotPageFooter="bg-surface-50-900-token">
    <AppBar
            gridColumns="grid-cols-3"
            slotDefault="place-self-center"
            slotTrail="place-content-end"
            background="bg-white/70 dark:bg-surface-900/70 backdrop-blur-md"
            class="fixed top-0 left-0 w-full z-50 transition-all duration-200"
    >
        <svelte:fragment slot="lead">
            <div class="flex items-center gap-4">
                <button class="btn-icon btn-icon-sm md:hidden" on:click={drawerOpen}>
                   <span>
                      <svg viewBox="0 0 100 80" width="20" height="20" fill="currentColor">
                         <rect width="100" height="15"></rect>
                         <rect y="30" width="100" height="15"></rect>
                         <rect y="60" width="100" height="15"></rect>
                      </svg>
                   </span>
                </button>
                <a href="/"
                   class="text-2xl font-bold uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center text-surface-900-50-token">
                    <Logo class="inline h-8 w-auto mr-2"/>
                </a>
            </div>
        </svelte:fragment>

        <div class="hidden md:flex justify-center gap-1">
            {#each navLinks as link}
                <a href={link.href} class="btn btn-sm hover:variant-soft-primary {getActiveClass(link.href)}">
                    {link.label}
                </a>
            {/each}
        </div>

        <svelte:fragment slot="trail">
            <a href="/docs" class="btn variant-filled-primary font-bold shadow-lg">
                Get Synara
            </a>
        </svelte:fragment>
    </AppBar>

    <div class="w-full min-h-screen pt-24 pb-8 relative bg-surface-50-900-token transition-colors duration-200">
        <slot/>
    </div>

    <svelte:fragment slot="pageFooter">
        <footer class="bg-surface-100-800-token text-surface-700-300-token py-16 border-t border-surface-200-700-token transition-colors duration-200">

            <div class="container mx-auto px-8 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0">

                <div class="lg:w-1/2 lg:pr-24 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <a href="/"
                       class="flex items-center gap-3 text-surface-900-50-token hover:text-primary-500 transition-colors group">
                        <Logo class="h-10 w-auto group-hover:animate-pulse"/>
                    </a>
                    <p class="opacity-80 leading-relaxed">
                        The all-rounder music player tailored for your local library and streaming needs.
                        Open Source and free forever.
                    </p>
                </div>

                <div class="flex-1 w-full grid grid-cols-3 gap-8 lg:gap-12">

                    <div class="space-y-4">
                        <h4 class="h5 font-bold uppercase tracking-wider text-surface-900-50-token text-center lg:text-start">
                            Product</h4>
                        <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                            <a href="/features" class="hover:text-primary-500 transition-colors">Features</a>
                            <a href="/pricing" class="hover:text-primary-500 transition-colors">Pricing</a>
                            <a href="/changelog" class="hover:text-primary-500 transition-colors">Changelog</a>
                            <a href="/docs" class="hover:text-primary-500 transition-colors">Documentation</a>
                        </nav>
                    </div>

                    <div class="space-y-4">
                        <h4 class="h5 font-bold uppercase tracking-wider text-surface-900-50-token text-center lg:text-start">
                            Community</h4>
                        <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                            <a href="https://github.com/dertyp7214/synara" target="_blank"
                               class="hover:text-primary-500 transition-colors">GitHub</a>
                            <a href="#" class="hover:text-primary-500 transition-colors">Discord</a>
                            <a href="#" class="hover:text-primary-500 transition-colors">Twitter / X</a>
                            <a href="/faq" class="hover:text-primary-500 transition-colors">FAQ</a>
                        </nav>
                    </div>

                    <div class="space-y-4">
                        <h4 class="h5 font-bold uppercase tracking-wider text-surface-900-50-token text-center lg:text-start">
                            Legal</h4>
                        <nav class="flex flex-col gap-3 text-sm items-center lg:items-start">
                            <a href="/imprint" class="hover:text-primary-500 transition-colors">Imprint</a>
                            <a href="/privacy" class="hover:text-primary-500 transition-colors">Privacy Policy</a>
                            <a href="/terms" class="hover:text-primary-500 transition-colors">Terms of Service</a>
                        </nav>
                    </div>

                </div>
            </div>

            <div class="container mx-auto px-8 mt-10 pt-8 border-t border-surface-200-700-token flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
                <p>&copy; {new Date().getFullYear()} Synara Project. All rights reserved.</p>
                <p>Made with <span class="text-error-500 animate-pulse">♥</span> by the Community.</p>
            </div>
        </footer>
    </svelte:fragment>
</AppShell>