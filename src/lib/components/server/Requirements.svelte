<script lang="ts">
  import { requirements } from './content'
</script>

<!-- Requirements, as the input panel of a module: one labelled slot per item -->
<section class="module" aria-labelledby="req-h">
  <div class="module-head">
    <h2 id="req-h" class="module-title">What you need</h2>
    <span class="led ok" aria-hidden="true"></span>
  </div>
  <ul class="reqs">
    {#each requirements as r (r.title)}
      <li>
        <h3 class="h-sub">{r.title}</h3>
        <p class="meta mt-1.5">{r.body}</p>
      </li>
    {/each}
  </ul>
</section>

<style>
  .reqs {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  .reqs li {
    padding: 1.25rem;
  }
  .reqs li + li {
    border-top: 1px solid var(--color-line);
  }
  @media (min-width: 48rem) {
    .reqs {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .reqs li {
      padding: 1.5rem 1.75rem;
    }
    .reqs li + li {
      border-top: 0;
      border-left: 1px solid var(--color-line);
    }
  }
</style>
