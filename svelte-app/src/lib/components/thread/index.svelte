<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { createStreamStore } from '$lib/stream-store.svelte';
	import type { createThreadStore } from '$lib/thread-store.svelte';
	import type { createArtifactStore } from '$lib/artifact-store.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import {
		ArrowDown,
		PanelRightOpen,
		PanelRightClose,
		SquarePen,
		X,
		Plus,
		LoaderCircle
	} from 'lucide-svelte';
	import { LangGraphLogoSVG } from '../icons/langgraph.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { useFileUpload } from '$lib/hooks/use-file-upload.svelte';
	import {
		ensureToolCallsHaveResponses,
		DO_NOT_RENDER_ID_PREFIX
	} from '$lib/ensure-tool-responses';
	import { v4 as uuidv4 } from 'uuid';
	import type { Message, Checkpoint } from '@langchain/langgraph-sdk';
	import ContentBlocksPreview from './ContentBlocksPreview.svelte';
	import ThreadHistory from './history/index.svelte';
	import HumanMessage from './messages/HumanMessage.svelte';
	import AssistantMessage from './messages/AssistantMessage.svelte';
	import AssistantMessageLoading from './messages/AssistantMessageLoading.svelte';
	import { useMediaQuery } from '$lib/hooks/useMediaQuery.svelte';
	import { slide } from 'svelte/transition';

	const streamStore = getContext<ReturnType<typeof createStreamStore>>('stream');
	const threadStore = getContext<ReturnType<typeof createThreadStore>>('threads');
	const artifactStore = getContext<ReturnType<typeof createArtifactStore>>('artifact');

	const { state: streamState, submit, stop } = streamStore;
	const { state: threadState, getThreads } = threadStore;
	const { state: artifactState, open: openArtifact, close: closeArtifact, setContext: setArtifactContext } = artifactStore;

	let input = $state('');
	const {
		contentBlocks,
		handleFileUpload,
		removeBlock,
		resetBlocks,
		dragOver,
		handlePaste,
		setupDragDrop
	} = useFileUpload();

	let dropRef: HTMLDivElement;
	onMount(() => {
		setupDragDrop(dropRef);
	});

	let firstTokenReceived = $state(false);
	const isLargeScreen = useMediaQuery('(min-width: 1024px)');

	let threadId = $derived(page.url.searchParams.get('threadId'));
	let chatHistoryOpen = $derived(page.url.searchParams.get('chatHistoryOpen') === 'true');
	let hideToolCalls = $derived(page.url.searchParams.get('hideToolCalls') === 'true');

	function setThreadId(id: string | null) {
		const url = new URL(page.url);
		if (id) {
			url.searchParams.set('threadId', id);
		} else {
			url.searchParams.delete('threadId');
		}
		goto(url, { invalidateAll: true });
		closeArtifact();
		setArtifactContext({});
	}

	function setChatHistoryOpen(value: boolean) {
		const url = new URL(page.url);
		url.searchParams.set('chatHistoryOpen', String(value));
		goto(url, { keepFocus: true, noScroll: true, replaceState: true });
	}

	function setHideToolCalls(value: boolean) {
		const url = new URL(page.url);
		url.searchParams.set('hideToolCalls', String(value));
		goto(url, { keepFocus: true, noScroll: true, replaceState: true });
	}

	let prevMessageLength = 0;
	$effect(() => {
		if (
			streamState.messages.length !== prevMessageLength &&
			streamState.messages?.length &&
			streamState.messages[streamState.messages.length - 1].type === 'ai'
		) {
			firstTokenReceived = true;
		}
		prevMessageLength = streamState.messages.length;
	});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if ((input.trim().length === 0 && contentBlocks.length === 0) || streamState.isLoading)
			return;
		firstTokenReceived = false;

		const newHumanMessage: Message = {
			id: uuidv4(),
			type: 'human',
			content: [
				...(input.trim().length > 0 ? [{ type: 'text', text: input }] : []),
				...contentBlocks
			]
		};

		const toolMessages = ensureToolCallsHaveResponses(streamState.messages);

		const context =
			Object.keys(artifactState.context).length > 0 ? artifactState.context : undefined;

		submit(
			{ messages: [...toolMessages, newHumanMessage], context },
		);

		input = '';
		resetBlocks();
	}

	function handleRegenerate(parentCheckpoint: Checkpoint | null | undefined) {
		prevMessageLength = prevMessageLength - 1;
		firstTokenReceived = false;
		submit(undefined, {
			checkpoint: parentCheckpoint
		});
	}

	const chatStarted = $derived(!!threadId || !!streamState.messages.length);
	const hasNoAIOrToolMessages = $derived(
		!streamState.messages.find((m) => m.type === 'ai' || m.type === 'tool')
	);
</script>

<div class="flex h-screen w-full overflow-hidden">
	<div class="relative hidden lg:flex">
		{#if chatHistoryOpen}
			<div transition:slide|global={{ duration: 300, axis: 'x' }}>
				<ThreadHistory />
			</div>
		{/if}
	</div>

	<div class="grid w-full grid-cols-[1fr_0fr] transition-all duration-500" style="grid-template-columns: {artifactState.isOpen ? '3fr 2fr' : '1fr 0fr'}">
		<div class="relative flex min-w-0 flex-1 flex-col overflow-hidden">
			{#if !chatStarted}
				<div class="absolute top-0 left-0 z-10 flex w-full items-center justify-between gap-3 p-2 pl-4">
					<div>
						{#if !chatHistoryOpen || !$isLargeScreen}
							<Button
								class="hover:bg-gray-100"
								variant="ghost"
								on:click={() => setChatHistoryOpen(!chatHistoryOpen)}
							>
								{#if chatHistoryOpen}
									<PanelRightOpen class="size-5" />
								{:else}
									<PanelRightClose class="size-5" />
								{/if}
							</Button>
						{/if}
					</div>
					<div class="absolute top-2 right-4 flex items-center">
						<!-- OpenGitHubRepo -->
					</div>
				</div>
			{/if}
			{#if chatStarted}
				<div class="relative z-10 flex items-center justify-between gap-3 p-2">
					<div class="relative flex items-center justify-start gap-2">
						<div class="absolute left-0 z-10">
							{#if !chatHistoryOpen || !$isLargeScreen}
								<Button
									class="hover:bg-gray-100"
									variant="ghost"
									on:click={() => setChatHistoryOpen(!chatHistoryOpen)}
								>
									{#if chatHistoryOpen}
										<PanelRightOpen class="size-5" />
									{:else}
										<PanelRightClose class="size-5" />
									{/if}
								</Button>
							{/if}
						</div>
						<button
							class="flex cursor-pointer items-center gap-2"
							on:click={() => setThreadId(null)}
							style="margin-left: {!chatHistoryOpen ? '48px' : '0'}"
						>
							<LangGraphLogoSVG width={32} height={32} />
							<span class="text-xl font-semibold tracking-tight">Agent Chat</span>
						</button>
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center">
							<!-- OpenGitHubRepo -->
						</div>
						<Button
							size="lg"
							class="p-4"
							variant="ghost"
							on:click={() => setThreadId(null)}
						>
							<SquarePen class="size-5" />
						</Button>
					</div>

					<div
						class="from-background to-background/0 absolute inset-x-0 top-full h-5 bg-gradient-to-b"
					/>
				</div>
			{/if}

			<div class="relative flex-1 overflow-y-scroll px-4 pt-8 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full">
				{#each streamState.messages.filter(m => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX)) as message (message.id)}
					{#if message.type === 'human'}
						<HumanMessage {message} isLoading={streamState.isLoading} />
					{:else}
						<AssistantMessage {message} isLoading={streamState.isLoading} {handleRegenerate} />
					{/if}
				{/each}
				{#if hasNoAIOrToolMessages && streamState.interrupt}
					<AssistantMessage message={undefined} isLoading={streamState.isLoading} {handleRegenerate} />
				{/if}
				{#if streamState.isLoading && !firstTokenReceived}
					<AssistantMessageLoading />
				{/if}
			</div>

			<div class="sticky bottom-0 flex flex-col items-center gap-8 bg-white" bind:this={dropRef}>
				{#if !chatStarted}
					<div class="flex items-center gap-3">
						<LangGraphLogoSVG class="h-8 flex-shrink-0" />
						<h1 class="text-2xl font-semibold tracking-tight">Agent Chat</h1>
					</div>
				{/if}
				<form onsubmit={handleSubmit} class="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
					<ContentBlocksPreview blocks={contentBlocks} onRemove={removeBlock} />
					<Textarea
						bind:value={input}
						on:paste={handlePaste}
						on:keydown={(e) => {
							if (
								e.key === 'Enter' &&
								!e.shiftKey &&
								!e.metaKey
							) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
						placeholder="Type your message..."
						class="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
					/>

					<div class="flex items-center gap-6 p-2 pt-4">
						<div class="flex items-center space-x-2">
							<Switch
								id="render-tool-calls"
								checked={hideToolCalls}
								onCheckedChange={setHideToolCalls}
							/>
							<Label for="render-tool-calls" class="text-sm text-gray-600">
								Hide Tool Calls
							</Label>
						</div>
						<Label for="file-input" class="flex cursor-pointer items-center gap-2">
							<Plus class="size-5 text-gray-600" />
							<span class="text-sm text-gray-600">Upload PDF or Image</span>
						</Label>
						<input
							id="file-input"
							type="file"
							on:change={handleFileUpload}
							multiple
							accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
							class="hidden"
						/>
						{#if streamState.isLoading}
							<Button key="stop" on:click={() => stop()} class="ml-auto">
								<LoaderCircle class="h-4 w-4 animate-spin" />
								Cancel
							</Button>
						{:else}
							<Button
								type="submit"
								class="ml-auto shadow-md transition-all"
								disabled={streamState.isLoading || (input.trim() === '' && contentBlocks.length === 0)}
							>
								Send
							</Button>
						{/if}
					</div>
				</form>
			</div>
		</div>
		<div class="relative flex flex-col border-l">
			{#if artifactState.isOpen}
				<div class="absolute inset-0 flex min-w-[30vw] flex-col">
					<div class="grid grid-cols-[1fr_auto] border-b p-4">
						<div class="truncate overflow-hidden">{artifactState.title}</div>
						<button on:click={() => closeArtifact()} class="cursor-pointer">
							<X class="size-5" />
						</button>
					</div>
					<div class="relative flex-grow">
						<svelte:component this={artifactState.component} {...artifactState.props} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
