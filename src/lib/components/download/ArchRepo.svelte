<script lang="ts">
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import { pacmanSnippet, type Channel } from '$lib/releases';

    let { channel }: { channel: Channel } = $props();
</script>

<section aria-labelledby="arch-h">
    <h3 id="arch-h" class="h-sub">Arch Linux</h3>
    <p class="meta mt-1.5">
        Add the Synara repository to <code class="code-inline">/etc/pacman.conf</code>, then install.
    </p>
    <CodeBlock class="mt-4" title="/etc/pacman.conf" code={pacmanSnippet(channel)}/>
    <CodeBlock class="mt-3" title="Terminal: Synara" code="sudo pacman -Sy synara"/>
    <CodeBlock class="mt-3" title="Terminal: Classic build" code="sudo pacman -Sy synara-classic"/>
</section>
