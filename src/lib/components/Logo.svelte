<script lang="ts">
  let { class: className = '', title = '' }: { class?: string; title?: string } = $props()
  // Unique per instance so several logos on one page don't share (and break) a gradient id.
  const uid = $props.id()
  const gradId = `synara-ribbon-${uid}`
</script>

<svg
  width="100%"
  height="100%"
  class={className}
  viewBox="120 20 280 440"
  xmlns="http://www.w3.org/2000/svg"
  role={title ? 'img' : undefined}
  aria-hidden={title ? undefined : 'true'}
  aria-label={title || undefined}
>
  <defs>
    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD700" />
      <stop offset="50%" stop-color="#FF4500" />
      <stop offset="100%" stop-color="#FF1493" />
    </linearGradient>
  </defs>
  <path
    d="M360,150 C360,80 230,80 200,130 C170,180 340,220 340,300 C340,380 210,420 160,380"
    fill="none"
    stroke="url(#{gradId})"
    stroke-width="45"
    stroke-linecap="round"
  />
</svg>
