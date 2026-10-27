<script lang="ts">
    import Inline from '$lib/components/content/Inline.svelte';
    import { envVars } from './content';
</script>

<!-- A printed specification plate, screwed to the panel -->
<div class="plate">
    <span class="screw top-2 left-2" aria-hidden="true"></span>
    <span class="screw top-2 right-2" style="--screw-angle: -25deg" aria-hidden="true"></span>
    <span class="screw bottom-2 left-2" style="--screw-angle: 60deg" aria-hidden="true"></span>
    <span class="screw right-2 bottom-2" style="--screw-angle: 5deg" aria-hidden="true"></span>
    <div class="overflow-x-auto">
        <table class="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
            <caption class="sr-only">Key environment variables</caption>
            <thead>
                <tr>
                    <th scope="col" class="legend">Variable</th>
                    <th scope="col" class="legend">What it does</th>
                    <th scope="col" class="legend">Default</th>
                </tr>
            </thead>
            <tbody>
                {#each envVars as v (v.name)}
                    <tr>
                        <th scope="row"><code class="readout text-ink">{v.name}</code></th>
                        <td class="text-ink/90"><Inline text={v.body}/></td>
                        <td>
                            {#if v.def}<code class="readout text-muted">{v.def}</code>{:else}<span class="text-faint">none</span>{/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .plate {
        position: relative;
        padding: 1.5rem 1.25rem;
        border-radius: var(--radius-key);
        border: 1px solid var(--color-line-strong);
        background: var(--plate-shade), var(--brush), var(--color-surface);
        box-shadow: var(--plate-edge), var(--plate-drop);
    }
    @media (min-width: 48rem) {
        .plate {
            padding: 2rem 2.25rem;
        }
    }
    th,
    td {
        padding: 0.8rem 1.5rem 0.8rem 0;
        vertical-align: top;
        border-bottom: 1px solid var(--color-line);
        font-weight: 400;
    }
    thead th {
        padding-top: 0;
        font-weight: 600;
        border-bottom: 2px solid var(--color-line-strong);
    }
    tbody tr:last-child :is(th, td) {
        border-bottom: 0;
        padding-bottom: 0;
    }
    td:last-child,
    th:last-child {
        padding-right: 0;
    }
</style>
