<script lang="ts">
  import Apple from '@lucide/svelte/icons/apple'
  import Store from '@lucide/svelte/icons/store'
  import { apple } from './content'

  let { yours = false, primary = false }: { yours?: boolean; primary?: boolean } = $props()
</script>

<article class="module {yours ? 'is-selected' : ''}" aria-labelledby="apple-h">
  <div class="module-head">
    <h2 id="apple-h" class="module-title">
      <Apple class="size-5" aria-hidden="true" />Apple
    </h2>
    {#if yours}
      <span class="tag tag-lit"><span class="led on" aria-hidden="true"></span>Your system</span>
    {:else}
      <span class="led" aria-hidden="true"></span>
    {/if}
  </div>
  <div class="module-body">
    <p class="meta">{apple.body}</p>
    <a
      href={apple.appStore.href}
      target="_blank"
      rel="noopener"
      class="key key-lg mt-6 w-full {primary ? 'key-primary' : ''}"
    >
      <Store class="size-5" aria-hidden="true" />
      {apple.appStore.label}
    </a>
  </div>
</article>
