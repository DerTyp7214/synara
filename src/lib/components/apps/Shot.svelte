<script lang="ts">
    import { shots, type ShotKey } from './shots';

    // A screenshot from static/apps/: AVIF with a WebP fallback, each with a srcset. Shots with a light
    // twin render both pictures and CSS shows the one for the active theme (the `light:` variant follows
    // data-theme and the OS), so the manual theme switch swaps them too. The hidden one is display:none
    // and lazy, so it is not fetched.
    let {
        key,
        alt,
        sizes,
        priority = false
    }: { key: ShotKey; alt: string; sizes: string; priority?: boolean } = $props();

    const s = $derived(shots[key]);
    const srcset = (theme: 'dark' | 'light', ext: 'avif' | 'webp') =>
        s.widths.map((w) => `${s.base}-${theme}-${w}.${ext} ${w}w`).join(', ');
    const src = (theme: 'dark' | 'light') => `${s.base}-${theme}-${s.widths[s.widths.length - 1]}.webp`;
</script>

{#snippet pic(theme: 'dark' | 'light', cls: string)}
    <picture class={cls}>
        <source type="image/avif" srcset={srcset(theme, 'avif')} {sizes}/>
        <img class="shot" draggable="false" src={src(theme)} srcset={srcset(theme, 'webp')} {sizes} {alt} width={s.w} height={s.h}
             loading="lazy" decoding="async" fetchpriority={priority ? 'high' : 'auto'}/>
    </picture>
{/snippet}

{#if s.light}
    {@render pic('dark', 'block light:hidden')}
    {@render pic('light', 'hidden light:block')}
{:else}
    {@render pic('dark', 'block')}
{/if}

<style>
    .shot {
        display: block;
        width: 100%;
        height: auto;
    }
</style>
