<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import { androidApkUrl, formatDate, formatSize, type AndroidInfo, type Channel } from '$lib/releases';

    let {
        channel,
        info,
        yours = false,
        primary = true
    }: { channel: Channel; info?: AndroidInfo; yours?: boolean; primary?: boolean } = $props();
    import { android } from './content';
</script>

<article class="module {yours ? 'is-selected' : ''}" aria-labelledby="android-h">
    <div class="module-head">
        <h2 id="android-h" class="module-title"><Smartphone class="size-5" aria-hidden="true"/>Android</h2>
        {#if yours}
            <span class="tag tag-lit"><span class="led on" aria-hidden="true"></span>Your system</span>
        {:else}
            <span class="led" aria-hidden="true"></span>
        {/if}
    </div>
    <div class="module-body">
        <p class="meta">{android.body}</p>
        <a href={androidApkUrl(channel)} class="key key-lg mt-6 w-full {primary ? 'key-primary' : ''}">
            <Download class="size-5" aria-hidden="true"/> Download APK
        </a>
        <p class="meta mt-3">
            {#if info}
                <span class="readout">Updated {formatDate(info.updated)}, {formatSize(info.size)}.</span>
            {/if}
            {android.install}
        </p>
    </div>
</article>
