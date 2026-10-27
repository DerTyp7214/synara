<script lang="ts">
  import Download from '@lucide/svelte/icons/download'
  import AppIcon from '$lib/components/AppIcon.svelte'
  import { sections } from '$lib/components/home/content'
  import './home.css'

  // Modern download CTA: an App Store-style listing row. The app icon, the name and platforms, and the
  // actions on the trailing side.
</script>

<section class="cta-section" aria-labelledby="m-cta-h">
  <div class="shell">
    <div class="mh-group listing">
      <span class="app-icon mh-squircle" aria-hidden="true"
        ><AppIcon class="size-[2.625rem]!" /></span
      >
      <div class="min-w-0 flex-1">
        <h2 id="m-cta-h" class="h-title">{sections.cta.title}</h2>
        <p class="mh-sub">{sections.cta.lead}</p>
      </div>
      <div class="actions">
        <a href="/download/" class="key key-primary"
          ><Download class="size-[1.05rem]" aria-hidden="true" />Go to downloads</a
        >
        <a href="/docs/" class="key">Read the docs</a>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-section {
    padding-block: clamp(1rem, 2vw, 2rem) clamp(3.5rem, 6vw, 5.5rem);
  }
  .listing {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem 1.25rem;
    padding: 1.25rem;
  }
  /* The app tile: a squircle, concentric with the card (26 - 20 inset ≈ the tile's own 14). The mark
     * is the app icon's foreground, sized so the S matches the brand S it replaced. */
  .app-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    border-radius: 0.875rem;
    background: var(--m-grouped-bg-3);
    box-shadow: inset 0 0 0 1px var(--color-line);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .listing {
      flex-wrap: nowrap;
      padding: 1.5rem 1.75rem;
      gap: 1.5rem;
    }
    .actions {
      width: auto;
      flex-shrink: 0;
    }
  }
</style>
