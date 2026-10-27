<script lang="ts">
  import DocView from '$lib/docs/DocView.svelte'

  let { data } = $props()
</script>

<DocView {data} />
