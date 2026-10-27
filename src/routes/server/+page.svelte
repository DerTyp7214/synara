<script lang="ts">
    import Requirements from '$lib/components/server/Requirements.svelte';
    import SetupSteps from '$lib/components/server/SetupSteps.svelte';
    import ServerNotes from '$lib/components/server/ServerNotes.svelte';
    import EnvTable from '$lib/components/server/EnvTable.svelte';
    import DocLinks from '$lib/components/server/DocLinks.svelte';
    import { intro } from '$lib/components/server/content';
</script>

<svelte:head>
    <title>Run a server | Synara</title>
    <meta
            name="description"
            content="Self-host Synara with Docker Compose: requirements, a minimal SQLite setup, a full setup with Postgres and a Redis cluster, environment variables and first steps."
    />
</svelte:head>

<section class="pt-10 pb-12 md:pt-16 md:pb-16" aria-labelledby="server-h">
    <div class="shell">
        <h1 id="server-h" class="h-display">{intro.title}</h1>
        <p class="lead mt-5">{intro.lead}</p>
    </div>
</section>

<div class="shell pb-16 md:pb-20">
    <Requirements/>
</div>

<section class="section section-ruled" aria-labelledby="setup-h">
    <div class="shell">
        <h2 id="setup-h" class="h-section">Set it up</h2>
        <div class="mt-12"><SetupSteps/></div>
    </div>
</section>

<section class="section section-ruled" aria-labelledby="notes-h">
    <div class="shell grid grid-cols-1 gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <h2 id="notes-h" class="h-section self-start">Good to know</h2>
        <ServerNotes/>
    </div>
</section>

<section class="section section-ruled" aria-labelledby="env-h">
    <div class="shell">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <h2 id="env-h" class="h-section">Key settings</h2>
                <p class="lead mt-4">{intro.envLead}</p>
            </div>
            <a class="link shrink-0 text-[0.9375rem]" href="/docs/environment_variables/">All environment variables</a>
        </div>
        <div class="mt-10"><EnvTable/></div>
    </div>
</section>

<section class="section section-ruled" aria-labelledby="docs-h">
    <div class="shell">
        <h2 id="docs-h" class="h-title">Go further in the docs</h2>
        <div class="mt-6"><DocLinks/></div>
    </div>
</section>
