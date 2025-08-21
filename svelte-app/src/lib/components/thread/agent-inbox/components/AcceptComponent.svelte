<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArgsRenderer from './ArgsRenderer.svelte';

	let {
		streaming,
		actionRequestArgs,
		handleSubmit,
	} = $props<{
		streaming: boolean;
		actionRequestArgs: Record<string, any>;
		handleSubmit: (e: MouseEvent | KeyboardEvent) => Promise<void>;
	}>();
</script>

<div class="flex w-full flex-col items-start gap-4 rounded-lg border-[1px] border-gray-300 p-6">
	{#if actionRequestArgs && Object.keys(actionRequestArgs).length > 0}
		<ArgsRenderer args={actionRequestArgs} />
	{/if}
	<Button
		variant="brand"
		disabled={streaming}
		on:click={handleSubmit}
		class="w-full"
	>
		Accept
	</Button>
</div>
