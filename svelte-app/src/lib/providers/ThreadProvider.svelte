<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { page } from '$app/state';
	import { createThreadStore } from '$lib/thread-store.svelte';
	import { getApiKey } from '$lib/api-key';

	let { children } = $props();

	const apiUrl = $derived(page.url.searchParams.get('apiUrl') || '');
	const assistantId = $derived(page.url.searchParams.get('assistantId') || '');

	let apiKey: string | null = null;
	onMount(() => {
		apiKey = getApiKey();
	});

	const threadStore = createThreadStore(apiUrl, apiKey, assistantId);
	setContext('threads', threadStore);
</script>

{@render children()}
