<script lang="ts">
  // Renders a plain string where `backticked` parts become inline code. Keeps copy in data files free of markup.
  let { text }: { text: string } = $props()
  const parts = $derived(text.split(/(`[^`]+`)/g).filter(Boolean))
</script>

{#each parts as part, i (i)}{#if part.startsWith('`') && part.endsWith('`')}<code
      class="code-inline">{part.slice(1, -1)}</code
    >{:else}{part}{/if}{/each}
