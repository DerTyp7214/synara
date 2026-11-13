<script lang="ts">
  import AppsRetro from '$lib/designs/retro/pages/AppsRetro.svelte'
  import AppsModern from '$lib/designs/modern/pages/AppsModern.svelte'
  import Credits from '$lib/components/apps/Credits.svelte'
</script>

<svelte:head>
  <title>Apps | Synara</title>
  <meta
    name="description"
    content="Screenshots of the Synara apps for Android, iPhone, iPad and desktop (Linux, Windows and macOS). Mac and Apple TV apps are coming later."
  />
</svelte:head>

<!-- Both designs are prerendered; CSS hides the inactive one (DESIGN.md, "Variants"). -->
<div class="design-retro contents"><AppsRetro /></div>
<div class="design-modern contents"><AppsModern /></div>

<!-- Demo content credits: shared by both designs. -->
<section class="apps-credits" aria-label="Demo content credits">
  <div class="shell">
    <Credits />
  </div>
</section>

<style>
  .apps-credits {
    padding-block: 1rem clamp(3rem, 6vw, 5rem);
  }
</style>
