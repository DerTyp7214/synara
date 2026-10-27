<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { onNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import { canTransition } from '$lib/designs/modern/motion'
  import { design } from '$lib/designs/design.svelte'
  import Header from '$lib/designs/retro/Header.svelte'
  import Footer from '$lib/designs/retro/Footer.svelte'
  import ModernHeader from '$lib/designs/modern/Header.svelte'
  import ModernFooter from '$lib/designs/modern/Footer.svelte'

  let { children } = $props()

  let bare = $derived(page.url.pathname.startsWith('/share'))

  onMount(() => design.sync())

  // Modern only: page changes run as a View Transition (a short push; the glass nav bar stays put).
  // Retro, reduced motion, unsupported browsers and same-page (hash) navigations skip it.
  onNavigate((navigation) => {
    if (!canTransition()) return
    if (navigation.from?.url.pathname === navigation.to?.url.pathname) return
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<svelte:head>
  <title>Synara</title>
</svelte:head>

{#if bare}
  {@render children()}
{:else}
  <a
    href="#main"
    class="key key-primary key-sm fixed top-3 left-3 z-[60] -translate-y-20 focus:translate-y-0"
    >Skip to content</a
  >
  <div class="flex min-h-dvh flex-col">
    <div class="design-retro contents"><Header /></div>
    <div class="design-modern contents"><ModernHeader /></div>
    <main id="main" class="flex-1">
      {@render children()}
    </main>
    <div class="design-retro contents"><Footer /></div>
    <div class="design-modern contents"><ModernFooter /></div>
  </div>
{/if}
