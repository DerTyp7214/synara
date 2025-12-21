<script lang="ts">
    import { themeStore, theme, type ThemeName } from '$lib/stores/theme';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';

    let { class: className = "" } = $props();

    let isOpen = $state(false);
    let menuRef: HTMLDivElement | undefined = $state();
    let mounted = $state(false);
    let themes: ThemeName[] = $state([]);

    function handleClickOutside(event: MouseEvent) {
        if (menuRef && !menuRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    function selectTheme(newTheme: ThemeName) {
        theme.set(newTheme);
        isOpen = false;
    }

    onMount(() => {
        mounted = true;
        try {
            themes = themeStore.getThemes();
        } catch {
            themes = ['crimson'];
        }

        if (browser) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    });

    const formatName = (name: string) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
</script>

{#if mounted}
    <div class="relative inline-block {className}" bind:this={menuRef}>
        <button
                onclick={() => isOpen = !isOpen}
                class="flex items-center justify-center p-2 rounded-lg transition-all duration-200
              bg-surface-100/50 dark:bg-surface-800/50 hover:bg-primary-500 hover:text-white
              border border-surface-200/50 dark:border-surface-700/50 backdrop-blur-sm"
                aria-label="Change theme"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
            </svg>
        </button>

        {#if isOpen}
            <div
                    transition:scale={{ duration: 150, start: 0.95 }}
                    class="absolute right-0 mt-2 w-64 z-50 overflow-hidden
                 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl
                 border border-surface-200 dark:border-surface-700
                 rounded-xl shadow-2xl ring-1 ring-black/5"
            >
                <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                    <p class="text-xs font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400">
                        Appearance
                    </p>
                </div>

                <div class="p-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600">
                    {#each themes as themeName}
                        <button
                                onclick={() => selectTheme(themeName)}
                                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                          { $theme === themeName
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                            : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200' }"
                        >
                            <div class="flex -space-x-1">
                                <div class="w-4 h-4 rounded-full border border-white/20" style="background: var(--color-primary-500);"></div>
                                <div class="w-4 h-4 rounded-full border border-white/20" style="background: var(--color-secondary-500);"></div>
                            </div>

                            <span class="flex-1 text-sm text-left">{formatName(themeName)}</span>

                            {#if $theme === themeName}
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}