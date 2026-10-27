<script lang="ts">
  import { page } from '$app/state'
  import ModernError from '$lib/designs/modern/ErrorState.svelte'

  let notFound = $derived(page.status === 404)
</script>

<svelte:head>
  <title>{notFound ? 'Page not found' : 'Something went wrong'} | Synara</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- Both designs are prerendered; CSS hides the inactive one (DESIGN.md, "Variants"). -->
<div class="design-retro contents">
  <section class="pt-10 pb-(--section-space) md:pt-16">
    <div
      class="shell grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16"
    >
      <div class="lcd screen order-first lg:order-last" aria-hidden="true">
        <div class="lcd-dim flex justify-between text-[0.75rem] tracking-[0.06em]">
          <span>INPUT</span><span>ERR {page.status}</span>
        </div>
        <p class="lcd-dots big">{notFound ? 'NO SIGNAL' : 'FAULT'}</p>
        <div class="lcd-dim flex justify-between text-[0.75rem] tracking-[0.06em]">
          <span>--:--</span><span>{notFound ? 'CHECK ADDRESS' : 'RETRY'}</span>
        </div>
      </div>
      <div>
        <h1 class="h-display">{notFound ? 'This page isn’t here.' : 'Something went wrong.'}</h1>
        <p class="lead mt-5">
          {notFound
            ? 'The address may be mistyped, or the page has moved. Try one of these instead.'
            : (page.error?.message ?? 'Try reloading the page, or head back to the start.')}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/" class="key key-primary">Home</a>
          <a href="/docs/" class="key">Docs</a>
          <a href="/download/" class="key">Download</a>
        </div>
      </div>
    </div>
  </section>
</div>
<div class="design-modern contents">
  <ModernError status={page.status} message={page.error?.message} />
</div>

<style>
  .screen {
    padding: 1rem 1.25rem;
  }
  .big {
    margin-block: 1.25rem;
    font-size: clamp(2.75rem, 2rem + 4vw, 4rem);
    line-height: 1;
    text-shadow: 0 0 1rem rgb(255 160 50 / 0.45);
    animation: flicker 1.6s steps(1) 4;
  }
  @keyframes flicker {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .big {
      animation: none;
    }
  }
</style>
