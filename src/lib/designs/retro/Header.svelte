<script lang="ts">
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';
    import Menu from '@lucide/svelte/icons/menu';
    import X from '@lucide/svelte/icons/x';
    import Logo_LONG from '$lib/components/Logo_LONG.svelte';
    import ThemeToggle from '$lib/designs/retro/ThemeToggle.svelte';
    import DesignToggle from '$lib/designs/DesignToggle.svelte';
    import { isActiveLink, mainLinks } from '$lib/nav';

    const links = mainLinks;

    let open = $state(false);

    function isActive(href: string) {
        return isActiveLink(href, page.url.pathname);
    }

    afterNavigate(() => (open = false));

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && open) open = false;
    }
</script>

<svelte:window onkeydown={onKeydown}/>

<header class="strip sticky top-0 z-50">
    <div class="shell flex h-(--header-h) items-center gap-4 md:gap-6">
        <a href="/" class="flex shrink-0 items-center gap-3 rounded-sm text-[0.95rem] text-ink" aria-label="Synara home">
            <Logo_LONG/>
            <span class="model" aria-hidden="true">SR-1</span>
        </a>

        <nav aria-label="Main" class="hidden md:block">
            <ul class="bank">
                {#each links as link (link.href)}
                    {@const active = isActive(link.href)}
                    <li>
                        <a href={link.href} aria-current={active ? 'page' : undefined}>
                            <span class="led {active ? 'on' : ''}" aria-hidden="true"></span>
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>

        <div class="ml-auto flex items-center gap-2">
            <DesignToggle/>
            <ThemeToggle/>
            <span class="power hidden sm:inline-flex" aria-hidden="true"><span class="led ok"></span>Power</span>
            <button
                    type="button"
                    class="key key-icon md:hidden"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    onclick={() => (open = !open)}
            >
                {#if open}<X class="size-5" aria-hidden="true"/>{:else}<Menu class="size-5" aria-hidden="true"/>{/if}
            </button>
        </div>
    </div>

    {#if open}
        <nav id="mobile-nav" aria-label="Main" class="mobile-nav md:hidden">
            <ul class="shell flex flex-col py-2">
                {#each links as link (link.href)}
                    {@const active = isActive(link.href)}
                    <li>
                        <a
                                href={link.href}
                                aria-current={active ? 'page' : undefined}
                                class="flex items-center gap-3.5 py-3.5 text-xl font-medium {active ? 'text-ink' : 'text-muted hover:text-ink'}"
                                onclick={() => (open = false)}
                        >
                            <span class="led {active ? 'on' : ''}" aria-hidden="true"></span>
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}
</header>

<style>
    .strip {
        background: var(--plate-shade), var(--brush), var(--color-surface);
        border-bottom: 1px solid var(--color-line);
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 1px 0 rgb(0 0 0 / 0.25);
    }

    /* Engraved model badge next to the wordmark */
    .model {
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.14em;
        color: var(--color-faint);
        padding: 0.15rem 0.4rem;
        border: 1px solid var(--color-line-strong);
        border-radius: var(--radius-tight);
        line-height: 1.1;
    }

    /* Nav: a bank of push-buttons in a recessed slot, LED lit on the current page */
    .bank {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: calc(var(--radius-key) + 2px);
        background: var(--color-recess);
        box-shadow: var(--well);
    }
    .bank a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 2.125rem;
        padding: 0.25rem 0.85rem 0.25rem 0.7rem;
        border-radius: var(--radius-key);
        border: 1px solid transparent;
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-muted);
        transition: color var(--dur-ui), background-color var(--dur-ui);
    }
    .bank a:hover {
        color: var(--color-ink);
        background: color-mix(in oklab, var(--color-ink) 6%, transparent);
    }
    .bank a[aria-current='page'] {
        color: var(--color-ink);
        border-color: var(--key-edge);
        background: linear-gradient(180deg, var(--key-top), var(--key-bottom));
        box-shadow: inset 0 1px 0 var(--key-hl), 0 1px 2px rgb(0 0 0 / 0.3);
    }
    .bank .led {
        width: 0.375rem;
        height: 0.375rem;
    }

    .power {
        align-items: center;
        gap: 0.4rem;
        margin-left: 0.25rem;
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.6875rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-faint);
    }
    .power .led {
        width: 0.375rem;
        height: 0.375rem;
    }

    .mobile-nav {
        border-top: 1px solid var(--color-line);
        animation: drop var(--dur-ui) var(--ease-out-soft);
    }
    .mobile-nav li + li {
        border-top: 1px solid var(--color-line);
    }
    @keyframes drop {
        from { opacity: 0; transform: translateY(-6px); }
    }
</style>
