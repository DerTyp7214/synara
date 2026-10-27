<script lang="ts">
  import Inline from '$lib/components/content/Inline.svelte'
  import { notes } from './content'
</script>

<dl class="grid gap-x-10 gap-y-8 md:grid-cols-2">
  {#each notes as n (n.title)}
    <div class="note">
      <dt class="h-sub">{n.title}</dt>
      <dd class="meta mt-1.5"><Inline text={n.body} /></dd>
    </div>
  {/each}
</dl>

<style>
  .note {
    padding-left: 1rem;
    border-left: 2px solid var(--color-line-strong);
  }
</style>
