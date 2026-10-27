<script lang="ts">
    import { apps, features, leadFeatures } from './content';
    const { lossless, imports } = leadFeatures;
</script>

<!-- Two lead features, each with a small piece of hardware that shows the idea -->
<div class="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
    <article class="min-w-0">
        <h3 class="h-title">{lossless.title}</h3>
        <p class="meta mt-2 max-w-lg">{lossless.body}</p>
        <div class="path mt-6" aria-hidden="true">
            <span class="lcd src">track.flac<span class="lcd-dim ml-3">24/96</span></span>
            <span class="wire"></span>
            <span class="outs">
                {#each lossless.formats as f, i (f)}
                    <span class="out"><span class="led {i === 0 ? 'on' : ''}"></span>{f}</span>
                {/each}
            </span>
        </div>
    </article>

    <article class="min-w-0">
        <h3 class="h-title">{imports.title}</h3>
        <p class="meta mt-2 max-w-lg">{imports.body}</p>
        <div class="mt-6">
            <span class="legend">Input</span>
            <ul class="inputs mt-2" aria-label="Import sources">
                {#each imports.sources as name (name)}
                    <li><span class="led on" aria-hidden="true"></span>{name}</li>
                {/each}
            </ul>
        </div>
    </article>
</div>

<!-- Everything else, as a specification sheet -->
<dl class="spec mt-16">
    {#each features as f (f.title)}
        <div>
            <dt>{f.title}</dt>
            <dd>{f.body}</dd>
        </div>
    {/each}
</dl>

<!-- Apps: three channel strips on one plate -->
<div class="strips faceplate mt-16">
    {#each apps as app (app.name)}
        <section class="strip {app.soon ? 'soon' : ''}" aria-label="{app.name} app">
            <div class="strip-head">
                <h3 class="h-title {app.soon ? 'text-muted' : ''}">{app.name}</h3>
                <span class="led {app.soon ? '' : 'ok'}" aria-hidden="true"></span>
            </div>
            <p class="legend mt-1">{app.note}</p>
            <ul class="mt-5 space-y-2 text-[0.9375rem] {app.soon ? 'text-muted' : 'text-ink/90'}">
                {#each app.items as item (item)}
                    <li class="flex gap-3"><span class="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" aria-hidden="true"></span>{item}</li>
                {/each}
            </ul>
        </section>
    {/each}
</div>

<style>
    .path {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
    }
    .src {
        padding: 0.6rem 0.9rem;
        font-size: 0.875rem;
    }
    .wire {
        width: 2rem;
        height: 3px;
        border-radius: 2px;
        background: var(--color-accent);
    }
    .outs,
    .inputs {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 3px;
        border-radius: calc(var(--radius-key) + 2px);
        background: var(--color-recess);
        box-shadow: var(--well);
    }
    .out,
    .inputs li {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.85rem 0.45rem 0.7rem;
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.9375rem;
        letter-spacing: 0.06em;
        color: var(--color-ink);
    }
    .out .led,
    .inputs .led {
        width: 0.375rem;
        height: 0.375rem;
    }

    .strips {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
    }
    .strip {
        padding: 1.5rem 1.5rem 1.75rem;
    }
    .strip + .strip {
        border-top: 1px solid var(--color-line);
    }
    .strip-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    @media (min-width: 48rem) {
        .strips {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .strip + .strip {
            border-top: 0;
            border-left: 1px solid var(--color-line);
        }
        .strip {
            padding: 1.75rem 2rem 2rem;
        }
    }
</style>
