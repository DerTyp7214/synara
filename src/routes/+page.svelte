<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import HeroVisual from '$lib/designs/retro/home/HeroVisual.svelte';
    import HowItWorks from '$lib/designs/retro/home/HowItWorks.svelte';
    import Features from '$lib/designs/retro/home/Features.svelte';
    import SetupTeaser from '$lib/designs/retro/home/SetupTeaser.svelte';
    import ModernHero from '$lib/designs/modern/home/Hero.svelte';
    import ModernHowItWorks from '$lib/designs/modern/home/HowItWorks.svelte';
    import ModernFeatures from '$lib/designs/modern/home/Features.svelte';
    import ModernSetupTeaser from '$lib/designs/modern/home/SetupTeaser.svelte';
    import ModernCta from '$lib/designs/modern/home/Cta.svelte';
    import { hero, sections } from '$lib/components/home/content';
</script>

<svelte:head>
    <title>Synara | Your music, bit for bit</title>
    <meta
            name="description"
            content="Synara is a music server you run yourself, with native apps for Android and desktop. Keep your FLAC, WAV and AIFF library lossless, import from Tidal, Apple Music, YouTube and SoundCloud, and scrobble to ListenBrainz and Last.fm."
    />
</svelte:head>

<!-- Both designs are prerendered; CSS hides the inactive one (DESIGN.md, "Variants"). -->
<div class="design-retro contents">
<!-- Hero: the front panel -->
<section class="pt-6 pb-(--section-space) md:pt-10" aria-labelledby="hero-h">
    <div class="shell">
        <div class="faceplate front">
            <span class="screw top-2.5 left-2.5" aria-hidden="true"></span>
            <span class="screw top-2.5 right-2.5" style="--screw-angle: -30deg" aria-hidden="true"></span>
            <span class="screw bottom-2.5 left-2.5" style="--screw-angle: 70deg" aria-hidden="true"></span>
            <span class="screw right-2.5 bottom-2.5" style="--screw-angle: 10deg" aria-hidden="true"></span>

            <div class="front-top" aria-hidden="true">
                <span class="legend text-ink!">Synara SR-1<span class="ml-3 font-medium text-faint">Network music server</span></span>
                <span class="formats">
                    {#each hero.formats as f (f)}<span><span class="led on"></span>{f}</span>{/each}
                </span>
            </div>

            <div class="front-grid">
                <div class="min-w-0">
                    <h1 id="hero-h" class="h-display">{hero.title}</h1>
                    <p class="lead mt-6">{hero.lead}</p>
                    <div class="mt-9 flex flex-wrap gap-3">
                        <a href="/download/" class="key key-primary key-lg"><Download class="size-4.5" aria-hidden="true"/>Download</a>
                        <a href="/server/" class="key key-lg">Run the server</a>
                    </div>
                    <p class="meta mt-7">{hero.licence}</p>
                </div>
                <div class="min-w-0">
                    <HeroVisual/>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- How it works -->
<section class="section section-ruled pt-[calc(var(--section-space)*0.8)]!" aria-labelledby="how-heading">
    <div class="shell">
        <div class="max-w-2xl">
            <h2 id="how-heading" class="h-section">{sections.how.title}</h2>
            <p class="lead mt-5">{sections.how.lead}</p>
        </div>
        <div class="mt-12 md:mt-14">
            <HowItWorks/>
        </div>
        <p class="meta mt-10 max-w-2xl">{sections.how.note}</p>
    </div>
</section>

</div>
<div class="design-modern contents">
    <ModernHero/>
    <ModernHowItWorks/>
</div>

<!-- Features: one anchor for /#features, whichever design is shown -->
<div id="features">
<div class="design-retro contents">
<section class="section section-ruled" aria-labelledby="features-heading">
    <div class="shell">
        <h2 id="features-heading" class="h-section max-w-2xl">{sections.features.title}</h2>
        <div class="mt-12">
            <Features/>
        </div>
    </div>
</section>

</div>
<div class="design-modern contents"><ModernFeatures/></div>
</div>

<div class="design-retro contents">
<!-- Self-hosting teaser -->
<section class="section section-ruled" aria-labelledby="host-heading">
    <div class="shell">
        <SetupTeaser/>
    </div>
</section>

<!-- Download: a one-unit rack module -->
<section class="pb-(--section-space)" aria-labelledby="cta-heading">
    <div class="shell">
        <div class="faceplate unit">
            <div class="min-w-0">
                <h2 id="cta-heading" class="h-title">{sections.cta.title}</h2>
                <p class="meta mt-1.5">{sections.cta.lead}</p>
            </div>
            <div class="flex flex-wrap gap-3">
                <a href="/download/" class="key key-primary key-lg"><Download class="size-4.5" aria-hidden="true"/>Go to downloads</a>
                <a href="/docs/" class="key key-lg">Read the docs</a>
            </div>
        </div>
    </div>
</section>
</div>
<div class="design-modern contents">
    <ModernSetupTeaser/>
    <ModernCta/>
</div>

<style>
    .front {
        padding: 1.75rem 1.25rem 1.5rem;
    }
    .front-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem 1.5rem;
        padding: 0 0.25rem 1rem;
        margin-bottom: 1.75rem;
        border-bottom: 1px solid var(--color-line);
    }
    .formats {
        display: inline-flex;
        gap: 1rem;
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        color: var(--color-faint);
    }
    .formats > span {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }
    .formats .led {
        width: 0.375rem;
        height: 0.375rem;
    }
    .front-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 2.5rem;
        padding-inline: 0.25rem;
    }
    @media (min-width: 40rem) {
        .front {
            padding: 2rem 2.25rem 2.25rem;
        }
    }
    @media (min-width: 64rem) {
        .front {
            padding: 2.25rem 3rem 3rem;
        }
        .front-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 27rem);
            gap: 4rem;
            align-items: center;
        }
    }

    .unit {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem 1.25rem;
    }
    @media (min-width: 48rem) {
        .unit {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 1.75rem 2.25rem;
        }
    }
</style>
