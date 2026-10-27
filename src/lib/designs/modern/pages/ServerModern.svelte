<script lang="ts">
  import ChevronRight from '@lucide/svelte/icons/chevron-right'
  import Container from '@lucide/svelte/icons/container'
  import Globe from '@lucide/svelte/icons/globe'
  import HardDrive from '@lucide/svelte/icons/hard-drive'
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert'
  import CodeBlock from '$lib/components/CodeBlock.svelte'
  import Inline from '$lib/components/content/Inline.svelte'
  import ChannelToggle from '$lib/components/download/ChannelToggle.svelte'
  import {
    fullCompose,
    minimalCompose,
    postgresCompose,
    serverFallsBack,
    serverImage,
    type Channel,
  } from '$lib/releases'
  import {
    composeVariants,
    docLinks,
    envVars,
    firstSteps,
    intro,
    notes,
    requirements,
    startCommands,
  } from '$lib/components/server/content'
  import '$lib/designs/modern/pages/groups.css'

  let channel = $state<Channel>('stable')
  type Variant = keyof typeof composeVariants
  const variants = Object.keys(composeVariants) as Variant[]
  const builders: Record<Variant, (c: Channel) => string> = {
    sqlite: minimalCompose,
    postgres: postgresCompose,
    full: fullCompose,
  }
  let variant = $state<Variant>('sqlite')
  const compose = $derived(builders[variant](channel))
  // Crossfade the code when a switch changes it, but not on first paint.
  let swapped = $state(false)
  const reqIcons = [Container, HardDrive, Globe]
</script>

<div class="shell mp">
  <header class="mp-side">
    <h1 id="m-server-h" class="h-display">{intro.title}</h1>
    <p class="lead mt-4">{intro.lead}</p>
  </header>

  <div class="mp-main">
    <section aria-labelledby="m-req-h">
      <h2 id="m-req-h" class="mg-head">What you need</h2>
      <ul class="mg-list">
        {#each requirements as r, i (r.title)}
          {@const Icon = reqIcons[i % reqIcons.length]}
          <li class="mg-row has-icon">
            <span class="mg-icon" aria-hidden="true"><Icon class="size-5" /></span>
            <div class="mg-text">
              <h3 class="mg-title">{r.title}</h3>
              <p class="mg-sub">{r.body}</p>
            </div>
          </li>
        {/each}
      </ul>
    </section>

    <section aria-labelledby="m-compose-h">
      <h2 id="m-compose-h" class="mg-head">1. Write a compose file</h2>
      <div class="mg-list" onclickcapture={() => (swapped = true)}>
        <div class="mg-picker">
          <span class="mg-label" id="m-setup-l">Setup</span>
          <div class="selector" role="group" aria-labelledby="m-setup-l">
            {#each variants as v (v)}
              <button type="button" aria-pressed={variant === v} onclick={() => (variant = v)}
                >{composeVariants[v].label}</button
              >
            {/each}
          </div>
        </div>
        <div class="mg-picker">
          <span class="mg-label" aria-hidden="true">Image</span>
          <ChannelToggle bind:channel />
        </div>
        {#key variant + channel}
          <div class="mg-body" class:swap={swapped}>
            <CodeBlock title="compose.yaml ({composeVariants[variant].label})" code={compose} />
          </div>
        {/key}
      </div>
      <p class="mg-foot" aria-live="polite">{composeVariants[variant].body}</p>
      {#if serverFallsBack(channel)}
        <p class="mg-foot warn">
          <TriangleAlert class="mt-px size-4 shrink-0" aria-hidden="true" />
          <span
            >No stable server image yet, so this file uses the dev images (<code class="code-inline"
              >{serverImage(channel)}</code
            >).</span
          >
        </p>
      {/if}
      <p class="mg-foot">
        Save it as <code class="code-inline">compose.yaml</code> in an empty folder. Change every
        <code class="code-inline">change-me</code> value before the first start.
      </p>
    </section>

    <section aria-labelledby="m-start-h">
      <h2 id="m-start-h" class="mg-head">2. Start it</h2>
      <div class="mg-list">
        <div class="mg-body"><CodeBlock title="Terminal" code={startCommands} /></div>
      </div>
      <p class="mg-foot">The server listens on port 8080. Follow the log until it's ready.</p>
    </section>

    <section aria-labelledby="m-connect-h">
      <h2 id="m-connect-h" class="mg-head">3. Connect an app</h2>
      <ol class="mg-list">
        {#each firstSteps as s, i (i)}
          <li class="mg-row has-icon">
            <span class="mg-num" aria-hidden="true">{i + 1}</span>
            <p class="mg-text mg-title" style="font-weight:400"><Inline text={s} /></p>
          </li>
        {/each}
      </ol>
      <p class="mg-foot">
        Use the admin account from your compose file. <a class="link" href="/download/"
          >Get the apps</a
        >.
      </p>
    </section>

    <section aria-labelledby="m-notes-h">
      <h2 id="m-notes-h" class="mg-head">Good to know</h2>
      <ul class="mg-list">
        {#each notes as n (n.title)}
          <li class="mg-row" style="align-items:flex-start">
            <div class="mg-text">
              <h3 class="mg-title">{n.title}</h3>
              <p class="mg-sub"><Inline text={n.body} /></p>
            </div>
          </li>
        {/each}
      </ul>
    </section>

    <section aria-labelledby="m-env-h">
      <h2 id="m-env-h" class="mg-head">Key settings</h2>
      <ul class="mg-list">
        {#each envVars as v (v.name)}
          <li class="mg-row" style="align-items:flex-start">
            <div class="mg-text">
              <code class="mg-title mono" style="font-weight:600">{v.name}</code>
              <p class="mg-sub"><Inline text={v.body} /></p>
              {#if v.def}<p class="mg-sub">Default: <code class="mono">{v.def}</code></p>{/if}
            </div>
          </li>
        {/each}
      </ul>
      <p class="mg-foot">
        {intro.envLead}
        <a class="link" href="/docs/environment_variables/">All environment variables</a>
      </p>
    </section>

    <section aria-labelledby="m-docs-h">
      <h2 id="m-docs-h" class="mg-head">Go further in the docs</h2>
      <ul class="mg-list">
        {#each docLinks as d (d.href)}
          <li>
            <a href={d.href} class="mg-row">
              <div class="mg-text">
                <p class="mg-title">{d.title}</p>
                <p class="mg-sub">{d.body}</p>
              </div>
              <ChevronRight class="mg-chev size-5" aria-hidden="true" />
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</div>
