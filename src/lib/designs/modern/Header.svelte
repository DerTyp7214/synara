<script lang="ts">
  import { page } from '$app/state'
  import { afterNavigate } from '$app/navigation'
  import { tick } from 'svelte'
  import Menu from '@lucide/svelte/icons/menu'
  import X from '@lucide/svelte/icons/x'
  import Logo_LONG from '$lib/components/Logo_LONG.svelte'
  import DesignToggle from '$lib/designs/DesignToggle.svelte'
  import ThemeSegmented from './ThemeSegmented.svelte'
  import { isActiveLink, mainLinks } from '$lib/nav'

  // Modern header: a floating Liquid Glass capsule, like the iOS 26 tab bar. Links sit in the bar from
  // md up; the appearance controls from lg up. Below that, a menu button opens a floating glass panel.
  const links = mainLinks

  let open = $state(false)
  let toggle: HTMLButtonElement | undefined = $state()
  let panel: HTMLDivElement | undefined = $state()

  const isActive = (href: string) => isActiveLink(href, page.url.pathname)

  afterNavigate(() => (open = false))

  async function setOpen(next: boolean, restoreFocus = false) {
    open = next
    if (next) {
      await tick()
      panel?.querySelector<HTMLElement>('a, button')?.focus()
    } else if (restoreFocus) {
      toggle?.focus()
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) setOpen(false, true)
  }

  function onPointerdown(e: PointerEvent) {
    if (!open) return
    const t = e.target as Node
    if (!panel?.contains(t) && !toggle?.contains(t)) open = false
  }
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

<header class="m-header">
  <div class="shell">
    <div class="bar glass">
      <a href="/" class="brand" aria-label="Synara home">
        <Logo_LONG />
      </a>

      <nav aria-label="Main" class="tabs">
        <ul>
          {#each links as link (link.href)}
            <li>
              <a
                href={link.href}
                class="tab"
                aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</a
              >
            </li>
          {/each}
        </ul>
      </nav>

      <div class="trailing">
        <div class="appearance">
          <DesignToggle />
          <ThemeSegmented />
        </div>
        <button
          type="button"
          class="menu-btn"
          bind:this={toggle}
          aria-expanded={open}
          aria-controls="m-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onclick={() => setOpen(!open)}
        >
          {#if open}<X class="size-5" aria-hidden="true" />{:else}<Menu
              class="size-5"
              aria-hidden="true"
            />{/if}
        </button>
      </div>
    </div>

    {#if open}
      <div id="m-menu" class="menu glass" bind:this={panel}>
        <nav aria-label="Main" class="menu-links">
          <ul class="menu-group">
            {#each links as link (link.href)}
              {@const active = isActive(link.href)}
              <li>
                <a
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onclick={() => (open = false)}
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        <div class="menu-appearance">
          <p class="menu-label" aria-hidden="true">Design</p>
          <DesignToggle class="menu-seg" />
          <p class="menu-label" aria-hidden="true">Appearance</p>
          <ThemeSegmented labels class="menu-seg" />
        </div>
      </div>
    {/if}
  </div>
</header>

<style>
  .m-header {
    position: sticky;
    top: 0;
    z-index: 50;
    padding-top: 0.625rem;
    /* Only the bar and the panel take pointer events; content scrolls under the gap around them. */
    pointer-events: none;
  }
  .m-header .shell {
    position: relative;
  }
  .bar,
  .menu {
    pointer-events: auto;
  }

  /* The capsule. Concentric: items inside are capsules inset by 6px. */
  .bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 3.25rem;
    padding: 0 0.375rem 0 1.125rem;
    border-radius: var(--m-radius-capsule);
  }
  .brand {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    min-height: 2.5rem;
    padding-inline: 0.25rem;
    border-radius: var(--m-radius-capsule);
    font-size: 1rem;
    color: var(--color-ink);
  }

  /* Tab-bar style links: the current page gets a filled capsule and tinted label. */
  .tabs {
    display: none;
    margin-left: 0.75rem;
  }
  .tabs ul {
    display: flex;
    gap: 0.125rem;
  }
  .tab {
    display: inline-flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0 0.95rem;
    border-radius: var(--m-radius-capsule);
    font-size: var(--ios-subheadline-size);
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    transition:
      background-color var(--dur-ui),
      color var(--dur-ui);
  }
  .tab:hover {
    background: var(--m-fill);
  }
  /* As in the app's tab bar: the selected item is a neutral pill with a tinted label. */
  .tab[aria-current='page'] {
    font-weight: 600;
    color: var(--color-accent-ink);
    background: var(--m-fill-strong);
  }

  .trailing {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-left: auto;
  }
  .appearance {
    display: none;
    align-items: center;
    gap: 0.375rem;
  }
  /* The design switch sits on the bar's glass: a plain fill track, not a second layer of glass. */
  :global([data-design='modern']) .bar :global(.dsw) {
    background: var(--m-seg-track);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: transparent;
    box-shadow: inset 0 0 0 1px var(--m-seg-border);
  }

  .menu-btn {
    display: inline-grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--m-fill);
    color: var(--color-ink);
    cursor: pointer;
    transition:
      transform var(--m-dur-press) var(--ease-spring),
      background-color var(--dur-ui);
  }
  .menu-btn:hover {
    background: var(--m-fill-strong);
  }
  .menu-btn:active {
    transform: scale(0.92);
  }

  @media (min-width: 48rem) {
    .tabs {
      display: block;
    }
  }
  @media (min-width: 64rem) {
    .appearance {
      display: flex;
    }
    .menu-btn {
      display: none;
    }
  }

  /* The menu: a floating glass panel under the bar (28, the large glass card). */
  .menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: var(--gutter);
    width: min(20rem, calc(100% - 2 * var(--gutter)));
    padding: 0.5rem;
    border-radius: var(--m-radius-card-lg);
    /* A menu holds text over text: thicker glass than the bar, so what scrolls behind can't compete. */
    background: var(--glass-specular), color-mix(in oklab, var(--glass-solid) 90%, transparent);
    transform-origin: top right;
    animation: pop var(--m-dur-panel) var(--m-ease-spring-soft);
  }
  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-0.25rem);
    }
  }
  .menu-group a {
    display: flex;
    align-items: center;
    min-height: 2.875rem;
    padding: 0 0.875rem;
    /* concentric with the panel: 28 - 8 */
    border-radius: 1.25rem;
    font-size: var(--ios-body-size);
    font-weight: 500;
    letter-spacing: var(--ios-body-tracking);
    color: var(--color-ink);
  }
  .menu-group a:hover {
    background: var(--m-fill);
  }
  .menu-group a[aria-current='page'] {
    font-weight: 600;
    color: var(--color-accent-ink);
    background: var(--m-fill-strong);
  }
  .menu-appearance {
    display: grid;
    gap: 0.375rem;
    margin-top: 0.375rem;
    padding: 0.625rem 0.375rem 0.375rem;
    border-top: 1px solid var(--color-line);
  }
  .menu-label {
    padding-left: 0.5rem;
    font-size: var(--ios-footnote-size);
    font-weight: 600;
    color: var(--color-muted);
  }
  .menu-label + :global(*) {
    margin-bottom: 0.375rem;
  }
  .menu-appearance :global(.menu-seg) {
    display: grid;
    width: 100%;
  }
  /* The design switch shows its names in the panel at every width. */
  :global([data-design='modern']) .menu :global(.dsw) {
    background: var(--m-seg-track);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: transparent;
    box-shadow: inset 0 0 0 1px var(--m-seg-border);
  }
  :global([data-design='modern']) .menu :global(.dsw .txt) {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip-path: none;
  }
  :global([data-design='modern']) .menu :global(.dsw .opt) {
    min-height: 2.25rem;
    font-size: var(--ios-subheadline-size);
  }
  @media (min-width: 48rem) {
    .menu-links {
      display: none;
    }
    .menu-appearance {
      margin-top: 0;
      border-top: 0;
    }
  }
</style>
