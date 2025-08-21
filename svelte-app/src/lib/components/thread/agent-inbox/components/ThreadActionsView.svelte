<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ThreadIdTooltip from './ThreadIdTooltip.svelte';
	import InboxItemInput from './InboxItemInput.svelte';
	import { useInterruptedActions } from '../hooks/use-interrupted-actions.svelte';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { constructOpenInStudioURL } from '../utils';
	import type { HumanInterrupt } from '@langchain/langgraph/prebuilt';
	import ButtonGroup from './ButtonGroup.svelte';

	let {
		interrupt,
		handleShowSidePanel,
		showState,
		showDescription,
	} = $props<{
		interrupt: HumanInterrupt;
		handleShowSidePanel: (showState: boolean, showDescription: boolean) => void;
		showState: boolean;
		showDescription: boolean;
	}>();

	const threadId = $derived(page.url.searchParams.get('threadId'));
	const apiUrl = $derived(page.url.searchParams.get('apiUrl'));

	const {
		state,
		handleSubmit,
		handleIgnore,
		handleResolve,
		supportsMultipleMethods,
		initialHumanInterruptEditValue
	} = useInterruptedActions({ interrupt });

	function handleOpenInStudio() {
		if (!apiUrl) {
			toast.error('Error', {
				description: 'Please set the LangGraph deployment URL in settings.'
			});
			return;
		}

		const studioUrl = constructOpenInStudioURL(apiUrl, threadId ?? undefined);
		window.open(studioUrl, '_blank');
	}

	const threadTitle = interrupt.action_request.action || 'Unknown';
	const actionsDisabled = state.loading || state.streaming;
	const ignoreAllowed = interrupt.config.allow_ignore;
</script>

<div class="flex min-h-full w-full flex-col gap-9">
	<!-- Header -->
	<div class="flex w-full flex-wrap items-center justify-between gap-3">
		<div class="flex items-center justify-start gap-3">
			<p class="text-2xl tracking-tighter text-pretty">{threadTitle}</p>
			{#if threadId}
				<ThreadIdTooltip {threadId} />
			{/if}
		</div>
		<div class="flex flex-row items-center justify-start gap-2">
			{#if apiUrl}
				<Button
					size="sm"
					variant="outline"
					class="flex items-center gap-1 bg-white"
					on:click={handleOpenInStudio}
				>
					Studio
				</Button>
			{/if}
			<ButtonGroup
				onShowState={() => handleShowSidePanel(true, false)}
				onShowDescription={() => handleShowSidePanel(false, true)}
				showingState={showState}
				showingDescription={showDescription}
			/>
		</div>
	</div>

	<div class="flex w-full flex-row items-center justify-start gap-2">
		<Button
			variant="outline"
			class="border-gray-500 bg-white font-normal text-gray-800"
			on:click={handleResolve}
			disabled={actionsDisabled}
		>
			Mark as Resolved
		</Button>
		{#if ignoreAllowed}
			<Button
				variant="outline"
				class="border-gray-500 bg-white font-normal text-gray-800"
				on:click={handleIgnore}
				disabled={actionsDisabled}
			>
				Ignore
			</Button>
		{/if}
	</div>

	<!-- Actions -->
	<InboxItemInput
		acceptAllowed={state.acceptAllowed}
		hasEdited={state.hasEdited}
		hasAddedResponse={state.hasAddedResponse}
		interruptValue={interrupt}
		humanResponse={state.humanResponse}
		initialValues={initialHumanInterruptEditValue.current}
		setHumanResponse={(value) => (state.humanResponse = value)}
		streaming={state.streaming}
		streamFinished={state.streamFinished}
		supportsMultipleMethods={supportsMultipleMethods}
		setSelectedSubmitType={(value) => (state.selectedSubmitType = value)}
		setHasAddedResponse={(value) => (state.hasAddedResponse = value)}
		setHasEdited={(value) => (state.hasEdited = value)}
		{handleSubmit}
	/>
</div>
