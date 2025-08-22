<script lang="ts">
  import { artifactStore } from '$lib/stores/artifact';
  import { artifactMap } from '$lib/artifact-map';
  import type { ComponentType } from 'svelte';

  let component: ComponentType | null;
  $: {
    if ($artifactStore.name) {
      component = artifactMap[$artifactStore.name];
    } else {
      component = null;
    }
  }
</script>

{#if $artifactStore.isOpen && component}
  <svelte:component this={component} props={$artifactStore.props} />
{/if}
