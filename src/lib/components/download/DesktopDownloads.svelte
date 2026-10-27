<script lang="ts">
  import Download from '@lucide/svelte/icons/download'
  import Laptop from '@lucide/svelte/icons/laptop'
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert'
  import ArchRepo from './ArchRepo.svelte'
  import { desktop } from './content'
  import {
    DESKTOP_FILES,
    desktopFallsBack,
    desktopLinks,
    formatDate,
    type Channel,
    type DesktopFileKind,
  } from '$lib/releases'

  let {
    channel,
    updated,
    recommended,
  }: {
    channel: Channel
    /** When the builds were last updated, from the GitHub API. Null while unknown or on failure. */
    updated: string | null
    recommended: DesktopFileKind | null
  } = $props()

  const links = $derived(desktopLinks(channel, 'Synara'))
  const classic = $derived(desktopLinks(channel, 'ClassicApp'))
</script>

<article class="module min-w-0 {recommended ? 'is-selected' : ''}" aria-labelledby="desktop-h">
  <div class="module-head">
    <h2 id="desktop-h" class="module-title"><Laptop class="size-5" aria-hidden="true" />Desktop</h2>
    {#if updated}<span class="readout text-muted">Updated {formatDate(updated)}</span>{/if}
  </div>
  <div class="module-body">
    <p class="meta max-w-lg">{desktop.body}</p>
    {#if desktopFallsBack(channel)}
      <p class="mt-4 flex gap-2.5 text-[0.9375rem] text-warn">
        <TriangleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {desktop.fallback}
      </p>
    {/if}

    <ul class="files mt-6">
      {#each DESKTOP_FILES as f (f.kind)}
        {@const isRec = recommended === f.kind}
        <li class:rec={isRec}>
          <span class="led {isRec ? 'on' : ''}" aria-hidden="true"></span>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-semibold text-ink">
              {f.label}
              {#if isRec}<span class="tag tag-lit">Your system</span>{/if}
            </p>
            <p class="meta">{f.format} <span class="readout">({f.ext})</span></p>
          </div>
          <a href={links[f.kind]} class="key key-sm {isRec ? 'key-primary' : ''}">
            <Download class="size-4" aria-hidden="true" /> Download<span class="sr-only">
              {f.label} {f.ext}</span
            >
          </a>
        </li>
      {/each}
    </ul>

    <details class="disclosure mt-5">
      <summary>Classic build</summary>
      <p class="meta mt-3">{desktop.classic}</p>
      <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem]">
        {#each DESKTOP_FILES as f (f.kind)}
          <li><a class="link" href={classic[f.kind]}>{f.label} {f.ext}</a></li>
        {/each}
      </ul>
    </details>

    <div class="mt-9 border-t border-line pt-7">
      <ArchRepo {channel} />
    </div>
  </div>
</article>

<style>
  .files {
    border-radius: var(--radius-key);
    background: var(--color-recess);
    box-shadow: var(--well);
    padding: 3px;
  }
  .files li {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.8rem 0.75rem 0.8rem 1rem;
    border-radius: var(--radius-key);
  }
  .files li + li {
    border-top: 1px solid var(--color-line);
  }
  .files li.rec {
    background: color-mix(in oklab, var(--color-surface) 70%, var(--color-recess));
  }
  @media (max-width: 25.99rem) {
    .files li {
      flex-wrap: wrap;
    }
    .files li .key {
      margin-left: 1.4rem;
    }
  }
</style>
