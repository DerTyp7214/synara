<script lang="ts">
    import {page} from "$app/state";
</script>

<div class="h-screen w-full bg-surface-50-900-token flex flex-col justify-center items-center text-center p-4 space-y-8 relative overflow-hidden">

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/40 rounded-full blur-[128px] animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none"/>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[500px] h-[500px] bg-secondary-500/40 rounded-full blur-[128px] animate-pulse delay-1000 mix-blend-multiply dark:mix-blend-screen pointer-events-none"/>


    <div class="relative z-10 space-y-2 max-w-md text-surface-900-50-token">

        <h1 class="h1 font-bold text-6xl md:text-8xl bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            {page.status}
        </h1>

        <h2 class="h2 font-bold">
            {#if page.status === 404}
                Track Not Found
            {:else}
                System Glitch
            {/if}
        </h2>

        <p class="text-lg opacity-70">
            {#if page.status === 404}
                Whoops! It looks like this page has been skipped or removed from the playlist.
            {:else}
                {page.error?.message || "Something went wrong on our end."}
            {/if}
        </p>
    </div>

    <div class="relative z-10 flex gap-4">
        <a href="/" class="btn variant-glass-primary font-bold shadow-lg shadow-primary-500/20">
            Return Home
        </a>
    </div>

</div>