<script lang="ts">
  import { docLinks } from './content'
</script>

<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  {#each docLinks as d (d.href)}
    <li>
      <a href={d.href} class="doc module block h-full p-5">
        <span class="flex items-center justify-between gap-3">
          <span class="h-sub">{d.title}</span>
          <span class="led" aria-hidden="true"></span>
        </span>
        <span class="meta mt-1.5 block">{d.body}</span>
      </a>
    </li>
  {/each}
</ul>

<style>
  .doc {
    transition: border-color var(--dur-ui) var(--ease-out-soft);
  }
  .doc:hover {
    border-color: var(--color-line-strong);
  }
  .doc:hover .h-sub {
    color: var(--color-accent-ink);
  }
  .doc:hover .led {
    background: radial-gradient(circle at 40% 35%, #ffd2b0 0 18%, var(--color-accent) 55%);
    box-shadow: 0 0 0.45rem color-mix(in oklab, var(--color-accent) 75%, transparent);
  }
</style>
