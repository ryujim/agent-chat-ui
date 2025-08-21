<script lang="ts">
  import "../app.css";
  import { configStore } from '$lib/stores/config';
  import Setup from './Setup.svelte';

  let config = $configStore;
</script>

{#if config.apiUrl && config.assistantId}
  <slot />
{:else}
  <Setup />
{/if}
