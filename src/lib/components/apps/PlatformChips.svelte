<script lang="ts">
  import { PLATFORM_ORDER, platformNames, type PlatformRow } from './content'

  // Where a feature exists: one small chip per platform in a wrapping row, in a fixed order, with an
  // optional caption in front of a row. Chips use the shared .tag class, which each design restyles.
  let { rows }: { rows: PlatformRow[] } = $props()
  const sorted = (r: PlatformRow) => PLATFORM_ORDER.filter((p) => r.platforms.includes(p))
</script>

<div class="pc">
  {#each rows as r, i (i)}
    <div class="pc-row">
      {#if r.label}<span class="pc-label">{r.label}</span>{/if}
      <ul class="pc-chips" aria-label={r.label ?? 'Available on'}>
        {#each sorted(r) as p (p)}<li class="tag pc-chip">{platformNames[p]}</li>{/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .pc {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.625rem;
  }
  .pc-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem 0.5rem;
  }
  .pc-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-muted);
  }
  /* Platform names keep their own casing, also on Retro's engraved caps tags. */
  .pc-chip {
    text-transform: none;
    letter-spacing: 0.02em;
  }
  .pc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3125rem;
  }
</style>
