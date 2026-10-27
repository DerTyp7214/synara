<script lang="ts">
    // The Synara app icon's foreground (from the iOS Icon Composer layers): the detailed S with its
    // ribbon and music notes, transparent, for both themes. Use it where the site shows the *app*, as a
    // bare mark (no tile behind it). The brand wordmark is Logo / Logo_LONG.
    let { class: className = '', alt = '' }: { class?: string; alt?: string } = $props();
</script>

<img src="/brand/app-icon-fg.svg" {alt} width="440" height="440" decoding="async" class="app-icon {className}"/>

<style>
    .app-icon {
        display: inline-block;
        flex-shrink: 0;
        width: 4rem;
        height: 4rem;
    }
</style>
