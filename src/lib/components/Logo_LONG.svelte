<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import Logo_TEXT from "$lib/components/Logo_TEXT.svelte";

    let className = "";
    export { className as class };
    export let color: string = "";
</script>

<div class="flex flex-row items-center gap-3 {className}" style="color: {color}">
    <Logo class="h-10 w-auto"/>
    <Logo_TEXT class="h-4 w-auto"/>
</div>