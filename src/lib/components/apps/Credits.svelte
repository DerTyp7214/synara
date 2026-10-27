<script lang="ts">
  import { credits, demo } from './content'

  // "Demo content" credits for the CC-licensed covers in the screenshots. Shared by both designs:
  // it styles itself through tokens and the shared .disclosure class, which each design restyles.
  let { idPrefix = '' }: { idPrefix?: string } = $props()
</script>

<details class="disclosure credits">
  <summary id="{idPrefix}demo-h">{demo.title}</summary>
  <div class="credits-body">
    <p class="meta">{demo.body}</p>
    <ul class="credits-list" aria-labelledby="{idPrefix}demo-h">
      {#each credits as c (c.album)}
        <li>
          <a class="link" href={c.source} rel="noopener"><cite>{c.album}</cite></a> by {c.artist} ({c.year}),
          <a class="link" href={c.licenceUrl} rel="noopener license">{c.licence}</a>.
          {#if c.note}<span class="note">{c.note}</span>{/if}
        </li>
      {/each}
    </ul>
  </div>
</details>

<style>
  .credits-body {
    padding-top: 0.75rem;
    max-width: 46rem;
  }
  .credits-list {
    margin-top: 0.875rem;
    display: grid;
    gap: 0.5rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-muted);
  }
  .credits-list cite {
    font-style: italic;
  }
  .note {
    display: block;
    color: var(--color-faint);
    font-size: 0.875rem;
  }
</style>
