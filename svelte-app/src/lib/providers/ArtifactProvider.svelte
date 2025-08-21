<script lang="ts">
	import { setContext } from 'svelte';
	import { createArtifactStore } from '$lib/artifact-store.svelte';

	let { children } = $props();

	const artifactStore = createArtifactStore();
	setContext('artifact', artifactStore);
</script>

{@render children()}
