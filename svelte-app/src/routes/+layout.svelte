<script lang="ts">
  import "../app.css";
  import { configStore } from '$lib/stores/config';
  import Setup from './Setup.svelte';

  let config = $configStore;
</script>

<svelte:head>
  <title>Agent Chat</title>
</svelte:head>

{#if config.apiUrl && config.assistantId}
  <slot />
{:else}
  <Setup />
{/if}
