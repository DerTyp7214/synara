<script lang="ts">
    let className = "";
    export { className as class };
</script>
<svg
        width="100%"
        height="100%"
        class={className}
        viewBox="120 20 280 440"
        xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;"/>
            <stop offset="50%" style="stop-color:#FF4500;"/>
            <stop offset="100%" style="stop-color:#FF1493;"/>
        </linearGradient>
    </defs>
    <g>
        <path d="M360,150 C360,80 230,80 200,130 C170,180 340,220 340,300 C340,380 210,420 160,380"
              fill="none" stroke="url(#ribbonGrad)" stroke-width="45" stroke-linecap="round"/>
    </g>
</svg>