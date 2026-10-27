<script lang="ts">
  import Unlink from '@lucide/svelte/icons/link-2-off'
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert'

  // Modern error page: an iOS empty state (ContentUnavailableView). A large symbol, a title, one line
  // of direction and the ways out as capsule buttons.
  let { status, message }: { status: number; message?: string } = $props()

  let notFound = $derived(status === 404)
</script>

<section class="empty" aria-labelledby="m-error-h">
  <div class="shell">
    <div class="body">
      <span class="symbol" aria-hidden="true">
        {#if notFound}<Unlink />{:else}<TriangleAlert />{/if}
      </span>
      <h1 id="m-error-h" class="title">{notFound ? 'Page not found' : 'Something went wrong'}</h1>
      <p class="desc">
        {notFound
          ? 'The address may be mistyped, or the page has moved. Try one of these instead.'
          : (message ?? 'Try reloading the page, or head back to the start.')}
      </p>
      <div class="actions">
        <a href="/" class="key key-primary">Home</a>
        <a href="/docs/" class="key">Docs</a>
        <a href="/download/" class="key">Download</a>
      </div>
      {#if !notFound}<p class="code">Error {status}</p>{/if}
    </div>
  </div>
</section>

<style>
  .empty {
    display: grid;
    place-items: center;
    min-height: min(36rem, calc(100dvh - var(--header-h) - 6rem));
    padding-block: 3rem 5rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 26rem;
    margin-inline: auto;
    text-align: center;
  }
  .symbol {
    display: grid;
    place-items: center;
    color: var(--color-faint);
  }
  .symbol :global(svg) {
    width: 3.5rem;
    height: 3.5rem;
    stroke-width: 1.5;
  }
  .title {
    margin-top: 1.25rem;
    font-family: var(--font-display);
    font-size: var(--ios-title1-size);
    line-height: var(--ios-title1-leading);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }
  .desc {
    margin-top: 0.5rem;
    font-size: var(--ios-body-size);
    line-height: 1.45;
    letter-spacing: var(--ios-body-tracking);
    color: var(--color-muted);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.625rem;
    margin-top: 1.75rem;
  }
  .code {
    margin-top: 1.25rem;
    font-size: var(--ios-footnote-size);
    color: var(--color-faint);
  }
</style>
