<script lang="ts">
	import StateView from './components/StateView.svelte';
	import ThreadActionsView from './components/ThreadActionsView.svelte';
	import { getContext } from 'svelte';
	import type { createStreamStore } from '$lib/stream-store.svelte';
	import type { HumanInterrupt } from '@langchain/langgraph/prebuilt';

	let { interrupt } = $props<{
		interrupt: HumanInterrupt | HumanInterrupt[];
	}>();

	const interruptObj = Array.isArray(interrupt) ? interrupt[0] : interrupt;
	const streamStore = getContext<ReturnType<typeof createStreamStore>>('stream');
	const { state: streamState } = streamStore;

	let showDescription = $state(false);
	let showState = $state(false);
	const showSidePanel = $derived(showDescription || showState);

	function handleShowSidePanel(
		newShowState: boolean,
		newShowDescription: boolean
	) {
		if (newShowState && newShowDescription) {
			console.error('Cannot show both state and description');
			return;
		}
		if (newShowState) {
			showDescription = false;
			showState = true;
		} else if (newShowDescription) {
			showState = false;
			showDescription = true;
		} else {
			showState = false;
			showDescription = false;
		}
	}
</script>

<div class="flex h-[80vh] w-full flex-col overflow-y-scroll rounded-2xl bg-gray-50/50 p-8 lg:flex-row [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
	{#if showSidePanel}
		<StateView
			{handleShowSidePanel}
			description={interruptObj.description}
			values={streamState}
			view={showState ? 'state' : 'description'}
		/>
	{:else}
		<ThreadActionsView
			interrupt={interruptObj}
			{handleShowSidePanel}
			{showState}
			{showDescription}
		/>
	{/if}
</div>
