<script lang="ts">
  import Copy from '@lucide/svelte/icons/copy'
  import Check from '@lucide/svelte/icons/check'

  let {
    code,
    title = '',
    class: className = '',
  }: { code: string; title?: string; class?: string } = $props()

  let copied = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      copied = true
      clearTimeout(timer)
      timer = setTimeout(() => (copied = false), 1600)
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }
</script>

<!-- A terminal module: legend strip with a copy key, and the amber display. -->
<figure class="code-block {className}">
  <figcaption class="code-block-head">
    <span class="legend truncate text-[0.8125rem]! tracking-[0.04em]! normal-case!">{title}</span>
    <button type="button" class="key key-sm min-h-8! px-2.5!" onclick={copy}>
      <span class="led {copied ? 'ok' : ''}" aria-hidden="true"></span>
      {#if copied}
        <Check class="size-3.5" aria-hidden="true" /> Copied
      {:else}
        <Copy class="size-3.5" aria-hidden="true" /> Copy
      {/if}
    </button>
  </figcaption>
  <pre class="lcd"><code>{code}</code></pre>
</figure>
