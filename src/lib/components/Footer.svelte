<script lang="ts">
    import Logo from '$lib/components/Logo.svelte';
    import Logo_TEXT from '$lib/components/Logo_TEXT.svelte';

    const source = [
        { href: 'https://github.com/DerTyp7214/synara-api', label: 'Server source' },
        { href: 'https://github.com/DerTyp7214/SynaraDesktop', label: 'Desktop app source' },
        { href: 'https://github.com/DerTyp7214/Synara', label: 'Releases' }
    ];
    const site = [
        { href: '/docs/', label: 'Docs' },
        { href: '/server/', label: 'Run a server' },
        { href: '/download/', label: 'Download' },
        { href: '/privacy/', label: 'Privacy' }
    ];
    const year = new Date().getFullYear();
</script>

<!-- The rear panel: jacks with their legends, and the rating plate. -->
<footer class="rear mt-auto">
    <div class="shell py-12 md:py-16">
        <div class="vents" aria-hidden="true"></div>

        <div class="mt-10 grid gap-10 md:grid-cols-[1fr_1fr_minmax(0,1.35fr)] md:gap-12">
            <nav aria-labelledby="footer-source">
                <h2 id="footer-source" class="legend">On GitHub</h2>
                <ul class="mt-4 space-y-3">
                    {#each source as l (l.href)}
                        <li><a href={l.href} rel="noopener" class="jack-link"><span class="jack" aria-hidden="true"></span>{l.label}</a></li>
                    {/each}
                </ul>
            </nav>

            <nav aria-labelledby="footer-site">
                <h2 id="footer-site" class="legend">Synara</h2>
                <ul class="mt-4 space-y-3">
                    {#each site as l (l.href)}
                        <li><a href={l.href} class="jack-link"><span class="jack" aria-hidden="true"></span>{l.label}</a></li>
                    {/each}
                </ul>
            </nav>

            <div class="plate">
                <span class="screw top-2 left-2" aria-hidden="true"></span>
                <span class="screw top-2 right-2" style="--screw-angle: -20deg" aria-hidden="true"></span>
                <span class="screw bottom-2 left-2" style="--screw-angle: 80deg" aria-hidden="true"></span>
                <span class="screw right-2 bottom-2" aria-hidden="true"></span>
                <a href="/" class="inline-flex items-center gap-2.5 rounded-sm text-ink" aria-label="Synara home">
                    <Logo class="h-7 w-auto"/>
                    <Logo_TEXT class="h-3 w-auto"/>
                    <span class="model">Model SR-1</span>
                </a>
                <p class="mt-4 text-[0.9375rem] text-muted">
                    A music server you run yourself, with native apps that play your library bit for bit.
                </p>
                <dl class="ratings">
                    <div><dt>Server</dt><dd>GPL-2.0</dd></div>
                    <div><dt>Apps</dt><dd>Free</dd></div>
                    <div><dt>Made</dt><dd>© {year} Synara</dd></div>
                </dl>
            </div>
        </div>
    </div>
</footer>

<style>
    .rear {
        background: var(--color-recess);
        border-top: 1px solid var(--color-line);
        box-shadow: inset 0 1px 0 rgb(0 0 0 / 0.2);
    }
    .rear .vents {
        background: repeating-linear-gradient(90deg, color-mix(in oklab, var(--color-recess) 60%, #000) 0 1.5rem, transparent 1.5rem 2rem);
        box-shadow: none;
        height: 0.3125rem;
        opacity: 0.4;
    }
    .jack-link {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1rem;
        color: color-mix(in oklab, var(--color-ink) 88%, transparent);
        transition: color var(--dur-ui);
    }
    .jack-link:hover {
        color: var(--color-accent-ink);
    }
    /* A 3.5mm jack: a ring with a dark bore */
    .jack {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        border-radius: 50%;
        background: radial-gradient(circle, #000 0 30%, color-mix(in oklab, var(--color-surface) 60%, var(--color-ink) 25%) 34% 62%, var(--color-surface) 66%);
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.35), 0 1px 0 rgb(255 255 255 / 0.06);
        transition: box-shadow var(--dur-ui);
    }
    .jack-link:hover .jack {
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.35), 0 0 0 2px color-mix(in oklab, var(--color-accent) 60%, transparent);
    }

    /* Rating plate */
    .plate {
        position: relative;
        padding: 1.5rem 1.75rem;
        border-radius: var(--radius-key);
        background: var(--plate-shade), var(--brush), var(--color-surface);
        border: 1px solid var(--color-line-strong);
        box-shadow: var(--plate-edge);
    }
    .model {
        margin-left: 0.25rem;
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-faint);
    }
    .ratings {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        margin-top: 1.25rem;
        border-top: 1px solid var(--color-line);
    }
    .ratings div {
        flex: 1 1 auto;
        padding: 0.6rem 1rem 0 0;
    }
    .ratings div + div {
        padding-left: 1rem;
        border-left: 1px solid var(--color-line);
    }
    .ratings dt {
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.6875rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-faint);
    }
    .ratings dd {
        font-family: var(--font-mono);
        font-size: 0.8125rem;
        color: var(--color-ink);
    }
</style>
