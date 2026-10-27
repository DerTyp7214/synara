<script lang="ts">
  import Logo from '$lib/components/Logo.svelte'
  import Logo_TEXT from '$lib/components/Logo_TEXT.svelte'

  let { class: className = '', color = '' }: { class?: string; color?: string } = $props()
</script>

<span
  class="inline-flex flex-row items-center gap-2.5 {className}"
  style={color ? `color: ${color}` : undefined}
>
  <Logo class="h-[2.1em] w-auto shrink-0" />
  <Logo_TEXT class="h-[0.85em] w-auto" />
  <span class="sr-only">Synara</span>
</span>
