<script lang="ts">
  // Simple monochrome glyphs drawn for Synara, not official brand logos.
  let { name, class: className = 'size-5' }: { name: string; class?: string } = $props()
</script>

<svg
  class={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'Spotify'}
    <circle cx="12" cy="12" r="9.5" />
    <path
      d="M6.8 9.2c3.6-1 7.4-.7 10.6 1.1M7.6 12.6c3-.8 6-.5 8.6 1M8.5 15.7c2.3-.6 4.5-.4 6.4.7"
    />
  {:else if name === 'Apple Music'}
    <path d="M9 18V6.5l9-2V16" />
    <circle cx="6.8" cy="18" r="2.2" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="16" r="2.2" fill="currentColor" stroke="none" />
  {:else if name === 'YouTube Music'}
    <circle cx="12" cy="12" r="9.5" />
    <path d="M10 8.6v6.8l5.6-3.4z" fill="currentColor" />
  {:else if name === 'SoundCloud'}
    <path d="M3 14v2M5.5 12v4M8 10.5V16M10.5 9.5V16" />
    <path d="M10.5 16h7.2a3 3 0 0 0 .4-5.97A5 5 0 0 0 10.5 9.5" />
  {:else if name === 'Deezer'}
    <path d="M4 19v-3M8 19v-6M12 19V9M16 19v-9M20 19V6" />
  {:else if name === 'Tidal'}
    <path d="M8 3 4 7l4 4 4-4zM16 3l-4 4 4 4 4-4zM12 11l-4 4 4 4 4-4z" />
  {:else if name === 'Bandcamp'}
    <path d="M3 17 9 7h12l-6 10z" />
  {:else if name === 'Napster'}
    <path d="M5 14v-3a7 7 0 0 1 14 0v3" />
    <rect x="3.5" y="13" width="4" height="6" rx="1.5" fill="currentColor" />
    <rect x="16.5" y="13" width="4" height="6" rx="1.5" fill="currentColor" />
  {:else if name === 'Amazon Music'}
    <path d="M4 15.5c4.5 3 11 3 16 0" />
    <path d="M17 13.8l3 1.7-.9 3" />
    <path d="M8 12V8.5a4 4 0 0 1 8 0V12M8 10h8" />
  {:else if name === 'Discogs'}
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  {:else}
    <path
      d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
    />
  {/if}
</svg>
