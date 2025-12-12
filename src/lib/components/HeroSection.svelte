<script lang="ts">
    import { ArrowDown, Github, Play } from "lucide-svelte";
</script>

<section class="relative w-full min-h-screen -mt-24 pt-32 flex flex-col items-center justify-center px-6 overflow-hidden">

    <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>

    <div class="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen pointer-events-none"/>
    <div class="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen pointer-events-none"/>

    <div class="relative z-10 max-w-5xl mx-auto text-center">
        <div class="container w-full h-full mx-auto p-8 flex flex-col items-center text-center">

            <div class="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-full border border-surface-400/30 bg-surface-200/50 dark:bg-surface-800/50 backdrop-blur-sm mb-8 animate-fade-up">
                <span class="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse shadow-[0_0_10px_rgba(var(--color-primary-500))]"/>
                <span class="text-sm font-medium tracking-wide text-surface-900-50-token">Now supporting Tidal</span>
            </div>

            <h1 class="flex flex-col justify-center items-center font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up tracking-tight text-surface-900-50-token">
                Your Music.
                <br/>
                <span class="bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    Your Server.
                </span>
            </h1>

            <p class="flex justify-center text-center items-center text-lg md:text-xl text-surface-600-300-token max-w-xl mx-auto mb-8 animate-fade-up leading-relaxed">
                Synara is a self-hosted music player that delivers lossless audio quality with original FLAC files.
                Experience music the way it was meant to be heard.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
                <button type="button" class="btn variant-filled-primary gap-2 py-3 px-8 font-bold shadow-lg shadow-primary-500/20">
                    <Play class="w-5 h-5 fill-current"/>
                    Get Started
                </button>
                <button type="button" class="btn variant-ringed-surface gap-2 py-3 px-8 font-semibold hover:variant-soft-surface transition-all" on:click={() => window.open('https://github.com/dertyp7214/synara', '_blank')}>
                    <Github class="w-5 h-5"/>
                    GitHub
                </button>
            </div>

        </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 text-surface-900-50-token">
        <ArrowDown class="w-6 h-6"/>
    </div>

</section>