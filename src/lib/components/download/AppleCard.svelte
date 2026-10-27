<script lang="ts">
    import Apple from '@lucide/svelte/icons/apple';

    let { yours = false }: { yours?: boolean } = $props();
    import { apple } from './content';
</script>

<!-- A blanking plate: the rack slot is reserved, the module isn't installed yet. -->
<article class="module-blank" aria-labelledby="apple-h">
    <div class="module-head border-line!">
        <h2 id="apple-h" class="module-title text-muted!"><Apple class="size-5" aria-hidden="true"/>Apple</h2>
        <span class="tag">Coming soon</span>
    </div>
    <div class="module-body">
        <p class="meta">
            {apple.body}
            {#if yours}{apple.meanwhile}{/if}
        </p>
        <div class="vents mt-5" aria-hidden="true"></div>
    </div>
</article>
