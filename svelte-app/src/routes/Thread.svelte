<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "$lib/components/ui/tooltip";
	import LangGraphLogo from "$lib/components/icons/LangGraphLogo.svelte";
	import GitHub from "$lib/components/icons/GitHub.svelte";
	import AssistantMessage from "./messages/AssistantMessage.svelte";
	import AssistantMessageLoading from "./messages/AssistantMessageLoading.svelte";
	import HumanMessage from "./messages/HumanMessage.svelte";
	import ThreadHistory from "./history/ThreadHistory.svelte";
	import ContentBlocksPreview from "./ContentBlocksPreview.svelte";
	import Artifact from "./artifact/Artifact.svelte";
	import TooltipIconButton from "./TooltipIconButton.svelte";

	import { ArrowDown, LoaderCircle, PanelRightOpen, PanelRightClose, SquarePen, XIcon, Plus, CircleX } from "lucide-svelte";
	import { page } from "$app/stores";
	import { cn } from "$lib/utils";

	import { goto } from '$app/navigation';

	// URL-based state
	$: threadId = $page.url.searchParams.get('threadId');
	$: chatHistoryOpen = $page.url.searchParams.get('chatHistoryOpen') === 'true';
	$: hideToolCalls = $page.url.searchParams.get('hideToolCalls') === 'true';

	function updateUrlParam(key: string, value: string | null) {
		const url = new URL($page.url);
		if (value === null || value === 'false') {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value);
		}
		goto(url, { keepData: true, noScroll: true });
	}

	function setThreadId(id: string | null) {
		updateUrlParam('threadId', id);
		// also close artifact and reset context
		closeArtifact();
	}

	function setChatHistoryOpen(value: boolean) {
		updateUrlParam('chatHistoryOpen', value.toString());
	}

	function setHideToolCalls(value: boolean) {
		updateUrlParam('hideToolCalls', value.toString());
	}


	import { streamStore } from '$lib/stores/stream';

	// Stream store state
	const { messages, isLoading, error } = streamStore;

	// DUMMY STATE for the rest
	let artifactOpen = false;
	let input = "";
	let contentBlocks: any[] = [];
	let dragOver = false;
	let firstTokenReceived = false; // This will be handled by the store later
	let interrupt = null; // This will be handled by the store later
    let isLargeScreen = true; // dummy value

	function closeArtifact() {
		artifactOpen = false;
	}

	function handleSubmit(e: any) {
		e.preventDefault();
		if ((input.trim().length === 0 && contentBlocks.length === 0) || $isLoading) return;

		const newHumanMessage = {
			id: crypto.randomUUID(),
			type: "human",
			content: [
				...(input.trim().length > 0 ? [{ type: "text", text: input }] : []),
				...contentBlocks,
			],
		};

		// The original code ensures tool calls have responses. I'll need to add this logic back later.
		const toolMessages: any[] = [];

		streamStore.submit(
			{ messages: [...toolMessages, newHumanMessage] },
			{
				threadId: $page.url.searchParams.get('threadId'),
				// The original code had optimistic updates. I'll add this back later.
			}
		);

		setInput("");
		// setContentBlocks([]); // This will be handled by the file upload logic later
	}

	function handleRegenerate(e: any) {}
	function handleFileUpload(e: any) {}
	function handlePaste(e: any) {}
	function removeBlock(e: any) {}

	// Derived state
	$: chatStarted = !!threadId || messages.length > 0;

</script>

<!-- Main structure -->
<div class="flex h-screen w-full overflow-hidden">
	<!-- Chat History Panel -->
	<div class="relative hidden lg:flex">
		<!-- This will be animated later -->
		<div
			class="absolute z-20 h-full overflow-hidden border-r bg-white"
			style="width: 300px"
		>
			<ThreadHistory />
		</div>
	</div>

	<!-- Main Content -->
	<div
		class="grid w-full transition-all duration-500"
		class:grid-cols-1fr_0fr={!artifactOpen}
		class:grid-cols-3fr_2fr={artifactOpen}
	>
		<div
			class="relative flex min-w-0 flex-1 flex-col overflow-hidden"
			class:grid-rows-1fr={!chatStarted}
		>
			<!-- Header -->
			{#if !chatStarted}
				<div class="absolute top-0 left-0 z-10 flex w-full items-center justify-between gap-3 p-2 pl-4">
					<div>
						{#if !chatHistoryOpen || !isLargeScreen}
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
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<a
										href="https://github.com/langchain-ai/agent-chat-ui"
										target="_blank"
										class="flex items-center justify-center"
									>
										<GitHub
											width="24"
											height="24"
										/>
									</a>
								</TooltipTrigger>
								<TooltipContent side="left">
									<p>Open GitHub repo</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			{/if}

			{#if chatStarted}
				<div class="relative z-10 flex items-center justify-between gap-3 p-2">
					<div class="relative flex items-center justify-start gap-2">
						<div class="absolute left-0 z-10">
							{#if !chatHistoryOpen || !isLargeScreen}
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
						>
							<LangGraphLogo
								width={32}
								height={32}
							/>
							<span class="text-xl font-semibold tracking-tight">
								Agent Chat
							</span>
						</button>
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<a
											href="https://github.com/langchain-ai/agent-chat-ui"
											target="_blank"
											class="flex items-center justify-center"
										>
											<GitHub
												width="24"
												height="24"
											/>
										</a>
									</TooltipTrigger>
									<TooltipContent side="left">
										<p>Open GitHub repo</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<TooltipIconButton
							tooltip="New thread"
							variant="ghost"
							on:click={() => setThreadId(null)}
						>
							<SquarePen class="size-5" />
						</TooltipIconButton>
					</div>

					<div class="from-background to-background/0 absolute inset-x-0 top-full h-5 bg-gradient-to-b" />
				</div>
			{/if}

			<!-- Chat Messages -->
			<div class="relative flex-1 overflow-hidden">
				<div class="absolute inset-0 overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
					class:mt-25vh={!chatStarted}
					class:flex-col={!chatStarted}
					class:items-stretch={!chatStarted}
					class:grid={chatStarted}
					class:grid-rows-1fr_auto={chatStarted}
				>
					<div class="pt-8 pb-16  max-w-3xl mx-auto flex flex-col gap-4 w-full">
						{#each messages as message, index (message.id || `${message.type}-${index}`)}
							{#if message.type === 'human'}
								<HumanMessage {message} {isLoading} />
							{:else}
								<AssistantMessage {message} {isLoading} {handleRegenerate} />
							{/if}
						{/each}

						{#if !messages.find(m => m.type === 'ai' || m.type === 'tool') && interrupt}
							<AssistantMessage message={undefined} {isLoading} {handleRegenerate} />
						{/if}

						{#if isLoading && !firstTokenReceived}
							<AssistantMessageLoading />
						{/if}
					</div>

					<!-- Footer -->
					<div class="sticky bottom-0 flex flex-col items-center gap-8 bg-white">
						{#if !chatStarted}
							<div class="flex items-center gap-3">
								<LangGraphLogo class="h-8 flex-shrink-0" />
								<h1 class="text-2xl font-semibold tracking-tight">Agent Chat</h1>
							</div>
						{/if}

						<!-- ScrollToBottom button -->
						<div class="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2">
							<Button
								variant="outline"
								on:click={() => {}}
							>
								<ArrowDown class="h-4 w-4" />
								<span>Scroll to bottom</span>
							</Button>
						</div>

						<div
							class="bg-muted relative z-10 mx-auto mb-8 w-full max-w-3xl rounded-2xl shadow-xs transition-all"
							class:border-primary={dragOver}
							class:border-2={dragOver}
							class:border-dotted={dragOver}
							class:border={!dragOver}
							class:border-solid={!dragOver}
						>
							<form on:submit|preventDefault={handleSubmit} class="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
								<ContentBlocksPreview blocks={contentBlocks} onRemove={removeBlock} />
								<textarea
									bind:value={input}
									on:paste={handlePaste}
									on:keydown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.nativeEvent.isComposing) {
											e.preventDefault();
											const el = e.target as HTMLElement | undefined;
											const form = el?.closest('form');
											form?.requestSubmit();
										}
									}}
									placeholder="Type your message..."
									class="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
								></textarea>

								<div class="flex items-center gap-6 p-2 pt-4">
									<div>
										<div class="flex items-center space-x-2">
											<Switch
												id="render-tool-calls"
												checked={hideToolCalls ?? false}
												on:checkedChange={(e) => setHideToolCalls(e.detail)}
											/>
											<Label for="render-tool-calls" class="text-sm text-gray-600">Hide Tool Calls</Label>
										</div>
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
									{#if isLoading}
										<Button key="stop" on:click={() => {}} class="ml-auto">
											<LoaderCircle class="h-4 w-4 animate-spin" />
											Cancel
										</Button>
									{:else}
										<Button
											type="submit"
											class="ml-auto shadow-md transition-all"
											disabled={isLoading || (!input.trim() && contentBlocks.length === 0)}
										>
											Send
										</Button>
									{/if}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Artifact Panel -->
		<div class="relative flex flex-col border-l">
			<div class="absolute inset-0 flex min-w-[30vw] flex-col">
				<div class="grid grid-cols-[1fr_auto] border-b p-4">
					<!-- <ArtifactTitle class="truncate overflow-hidden" /> -->
					<button on:click={closeArtifact} class="cursor-pointer">
						<XIcon class="size-5" />
					</button>
				</div>
				<!-- <ArtifactContent class="relative flex-grow" /> -->
			</div>
		</div>
	</div>
</div>
