<script lang="ts">
	import { setContext } from 'svelte';
	import { createStreamStore } from '$lib/stream-store.svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';

	let { children, apiUrl, apiKey, assistantId } = $props();

	const threadId = $derived(page.url.searchParams.get('threadId'));

	const streamStore = createStreamStore(apiUrl, apiKey, assistantId, threadId);
	setContext('stream', streamStore);

	async function checkGraphStatus(
		apiUrl: string,
		apiKey: string | null,
	): Promise<boolean> {
		try {
			const res = await fetch(`${apiUrl}/info`, {
				headers: apiKey ? { "X-Api-Key": apiKey } : {},
			});
			return res.ok;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	$effect(() => {
		checkGraphStatus(apiUrl, apiKey).then((ok) => {
			if (!ok) {
				toast.error("Failed to connect to LangGraph server", {
					description: `Please ensure your graph is running at <code>${apiUrl}</code> and your API key is correctly set (if connecting to a deployed graph).`,
					duration: 10000,
				});
			}
		});
	});
</script>

{@render children()}
