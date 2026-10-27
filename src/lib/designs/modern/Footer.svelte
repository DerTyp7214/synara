<script lang="ts">
  import Logo_LONG from '$lib/components/Logo_LONG.svelte'
  import { siteLinks, sourceLinks } from '$lib/nav'

  // Modern footer: plain and grouped, like the bottom of an Apple product page. Small type, two link
  // groups, the licence line. No glass (it isn't chrome) and no rear-panel hardware.
  const year = new Date().getFullYear()
</script>

<footer class="m-footer mt-auto">
  <div class="shell">
    <div class="cols">
      <div class="about">
        <a href="/" class="brand" aria-label="Synara home"><Logo_LONG /></a>
        <p class="tagline">
          A music server you run yourself, with native apps that play your library bit for bit.
        </p>
      </div>

      <nav aria-labelledby="m-footer-site">
        <h2 id="m-footer-site" class="group-h">Synara</h2>
        <ul>
          {#each siteLinks as l (l.href)}
            <li><a href={l.href}>{l.label}</a></li>
          {/each}
        </ul>
      </nav>

      <nav aria-labelledby="m-footer-source">
        <h2 id="m-footer-source" class="group-h">On GitHub</h2>
        <ul>
          {#each sourceLinks as l (l.href)}
            <li><a href={l.href} rel="noopener">{l.label}</a></li>
          {/each}
        </ul>
      </nav>
    </div>

    <div class="base">
      <p>Server: GPL-2.0, apps free</p>
      <p>© {year} Synara</p>
    </div>
  </div>
</footer>

<style>
  .m-footer {
    margin-top: auto;
    padding-block: 3rem 2.5rem;
    background: var(--m-grouped-bg);
    border-top: 1px solid var(--color-line);
    font-size: var(--ios-footnote-size);
    letter-spacing: var(--ios-footnote-tracking);
    color: var(--color-muted);
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem 1.5rem;
  }
  .about {
    grid-column: 1 / -1;
    max-width: 22rem;
  }
  .brand {
    display: inline-flex;
    border-radius: var(--radius-tight);
    font-size: 0.875rem;
    color: var(--color-ink);
  }
  .tagline {
    margin-top: 0.875rem;
    line-height: var(--ios-footnote-leading);
  }
  .group-h {
    font-size: var(--ios-footnote-size);
    font-weight: 600;
    color: var(--color-ink);
  }
  ul {
    display: grid;
    gap: 0.125rem;
    margin-top: 0.625rem;
  }
  li a {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    border-radius: var(--radius-tight);
    color: var(--color-muted);
    transition: color var(--dur-ui);
  }
  li a:hover {
    color: var(--color-ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .base {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem 1.5rem;
    margin-top: 2.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-line);
    font-size: var(--ios-caption1-size);
  }
  @media (min-width: 48rem) {
    .cols {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
      gap: 3rem;
    }
    .about {
      grid-column: auto;
    }
  }
</style>
