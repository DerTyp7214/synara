<script lang="ts">
  import { page } from '$app/state'
  import { afterNavigate } from '$app/navigation'
  import Menu from '@lucide/svelte/icons/menu'
  import X from '@lucide/svelte/icons/x'
  import ExternalLink from '@lucide/svelte/icons/external-link'

  let { data, children } = $props()
  let open = $state(false)

  afterNavigate(() => (open = false))

  let current = $derived(
    data.nav.flatMap((g) => g.items).find((i) => !i.external && i.href === page.url.pathname)
      ?.title ?? 'Docs'
  )
</script>

<div class="shell docs-shell">
  <button
    type="button"
    class="docs-menu-btn key key-sm"
    aria-expanded={open}
    aria-controls="docs-nav"
    onclick={() => (open = !open)}
  >
    {#if open}<X class="size-4" aria-hidden="true" />{:else}<Menu
        class="size-4"
        aria-hidden="true"
      />{/if}
    <span class="truncate">{open ? 'Close menu' : current}</span>
  </button>

  <nav id="docs-nav" class="docs-nav" class:open aria-label="Documentation">
    {#each data.nav as group (group.title)}
      <section>
        <h2 class="legend">{group.title}</h2>
        <ul>
          {#each group.items as item (item.href)}
            <li>
              <a
                href={item.href}
                aria-current={item.href === page.url.pathname ? 'page' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener' : undefined}
              >
                <span class="led" aria-hidden="true"></span>
                <span class="flex-1">{item.title}</span>
                {#if item.external}<ExternalLink
                    class="size-3.5 shrink-0"
                    aria-hidden="true"
                  />{/if}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </nav>

  <div class="docs-main">
    {@render children()}
  </div>
</div>

<style>
  .docs-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0 3rem;
    padding-block: 1.25rem 4rem;
  }

  .docs-menu-btn {
    justify-self: start;
    max-width: 100%;
    margin-bottom: 1rem;
    text-transform: none;
    letter-spacing: 0.02em;
    font-size: 0.9375rem;
  }

  /* The index: a module on small screens, a quiet column with LEDs on large ones */
  .docs-nav {
    display: none;
    margin-bottom: 1.5rem;
    padding: 1rem 0.75rem;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-plate);
    background: var(--plate-shade), var(--brush), var(--color-surface);
    box-shadow: var(--plate-edge), var(--plate-drop);
    max-height: 70dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .docs-nav.open {
    display: block;
  }

  .docs-nav section + section {
    margin-top: 1.5rem;
  }
  .docs-nav h2 {
    margin-bottom: 0.4rem;
    padding-inline: 0.6rem;
  }
  .docs-nav a {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-key);
    font-size: 0.9375rem;
    line-height: 1.35;
    color: var(--color-muted);
    transition:
      color var(--dur-ui),
      background-color var(--dur-ui);
  }
  .docs-nav a .led {
    width: 0.375rem;
    height: 0.375rem;
  }
  .docs-nav a:hover {
    color: var(--color-ink);
    background: color-mix(in oklab, var(--color-ink) 6%, transparent);
  }
  .docs-nav a[aria-current='page'] {
    color: var(--color-ink);
    font-weight: 500;
    background: var(--color-recess);
    box-shadow: var(--well);
  }
  .docs-nav a[aria-current='page'] .led {
    background: radial-gradient(circle at 40% 35%, #ffd2b0 0 18%, var(--color-accent) 55%);
    box-shadow: 0 0 0.4rem color-mix(in oklab, var(--color-accent) 75%, transparent);
  }

  .docs-main {
    min-width: 0;
  }

  @media (min-width: 64rem) {
    .docs-shell {
      grid-template-columns: 16rem minmax(0, 1fr);
      padding-top: 2.5rem;
      align-items: start;
    }
    .docs-menu-btn {
      display: none;
    }
    .docs-nav {
      display: block;
      position: sticky;
      top: calc(var(--header-h) + 1.5rem);
      max-height: calc(100dvh - var(--header-h) - 3rem);
      margin: 0;
      padding: 0.25rem 1rem 1rem 0;
      border: 0;
      border-right: 1px solid var(--color-line);
      background: none;
      border-radius: 0;
      box-shadow: none;
    }
  }
  /* ---------- Modern: an iPad-style sidebar (grouped list, selection pill) ---------- */
  :global(:root[data-design='modern']) .docs-menu-btn {
    font-size: var(--ios-subheadline-size);
    letter-spacing: -0.01em;
  }
  :global(:root[data-design='modern']) .docs-nav {
    padding: 0.5rem;
    border: 0;
    border-radius: var(--m-radius-group);
    background: var(--m-grouped-bg-2);
    box-shadow: none;
  }
  :global(:root[data-design='modern']) .docs-nav section + section {
    margin-top: 0.75rem;
  }
  :global(:root[data-design='modern']) .docs-nav h2 {
    margin: 0;
    padding: 0.5rem 0.75rem 0.375rem;
  }
  :global(:root[data-design='modern']) .docs-nav a {
    min-height: 2.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: calc(var(--m-radius-group) - 0.5rem);
    font-size: var(--ios-callout-size);
    letter-spacing: var(--ios-callout-tracking);
    color: var(--color-ink);
    transition: background-color var(--dur-ui);
  }
  :global(:root[data-design='modern']) .docs-nav a:hover {
    background: color-mix(in oklab, var(--color-ink) 6%, transparent);
  }
  :global(:root[data-design='modern']) .docs-nav a[aria-current='page'] {
    background: var(--m-tint-fill);
    box-shadow: none;
    color: var(--color-accent-ink);
    font-weight: 600;
  }
  @media (min-width: 64rem) {
    :global(:root[data-design='modern']) .docs-nav {
      padding: 0.5rem;
      border: 0;
      border-radius: var(--m-radius-group);
      background: var(--m-grouped-bg-2);
    }
  }
</style>
