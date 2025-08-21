<script lang="ts">
	import type { AIMessage, Checkpoint, Message, MessageContentComplex } from '@langchain/langgraph-sdk';
	import { getContentString } from '../utils';
	import BranchSwitcher from './BranchSwitcher.svelte';
	import CommandBar from './CommandBar.svelte';
	import MarkdownText from '../MarkdownText.svelte';
	import { isAgentInboxInterruptSchema } from '$lib/agent-inbox-interrupt';
	import ThreadView from '../agent-inbox/index.svelte';
	import { page } from '$app/state';
	import GenericInterruptView from './generic-interrupt.svelte';
	import ToolCalls from './ToolCalls.svelte';
	import ToolResult from './ToolResult.svelte';
	import { getContext } from 'svelte';
	import type { createStreamStore } from '$lib/stream-store.svelte';

	let {
		message,
		isLoading,
		handleRegenerate,
	} = $props<{
		message: Message | undefined;
		isLoading: boolean;
		handleRegenerate: (parentCheckpoint: Checkpoint | null | undefined) => void;
	}>();

	const content = message?.content ?? [];
	const contentString = getContentString(content);
	const hideToolCalls = $derived(page.url.searchParams.get('hideToolCalls') === 'true');

	const streamStore = getContext<ReturnType<typeof createStreamStore>>('stream');
	const { state: streamState } = streamStore;
	const isLastMessage = $derived(
		streamState.messages[streamState.messages.length - 1]?.id === message?.id
	);
	const hasNoAIOrToolMessages = $derived(
		!streamState.messages.find((m) => m.type === 'ai' || m.type === 'tool')
	);
	const threadInterrupt = $derived(streamState.interrupt);

	// TODO: getMessagesMetadata
	const meta = undefined;
	const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;

	function parseAnthropicStreamedToolCalls(
		content: MessageContentComplex[]
	): AIMessage['tool_calls'] {
		const toolCallContents = content.filter((c) => (c as any).type === 'tool_use' && (c as any).id);

		return toolCallContents.map((tc) => {
			const toolCall = tc as Record<string, any>;
			let json: Record<string, any> = {};
			if (toolCall?.input) {
				try {
					json = JSON.parse(toolCall.input);
				} catch {
					// Pass
				}
			}
			return {
				name: toolCall.name ?? '',
				id: toolCall.id ?? '',
				args: json,
				type: 'tool_call'
			};
		});
	}

	const anthropicStreamedToolCalls = $derived(
		Array.isArray(content) ? parseAnthropicStreamedToolCalls(content) : undefined
	);

	const hasToolCalls = $derived(
		message && 'tool_calls' in message && message.tool_calls && message.tool_calls.length > 0
	);
	const toolCallsHaveContents = $derived(
		hasToolCalls && (message as AIMessage).tool_calls?.some((tc) => tc.args && Object.keys(tc.args).length > 0)
	);
	const hasAnthropicToolCalls = $derived(!!anthropicStreamedToolCalls?.length);
	const isToolResult = $derived(message?.type === 'tool');
</script>

{#if !(isToolResult && hideToolCalls)}
	<div class="group mr-auto flex items-start gap-2">
		<div class="flex flex-col gap-2">
			{#if isToolResult}
				<ToolResult {message} />
				{#if isAgentInboxInterruptSchema(threadInterrupt?.value) && (isLastMessage || hasNoAIOrToolMessages)}
					<ThreadView interrupt={threadInterrupt.value} />
				{:else if threadInterrupt && !isAgentInboxInterruptSchema(threadInterrupt?.value) && isLastMessage}
					<GenericInterruptView interrupt={threadInterrupt.value} />
				{/if}
			{:else}
				{#if contentString.length > 0}
					<div class="py-1">
						<MarkdownText source={contentString} />
					</div>
				{/if}

				{#if !hideToolCalls}
					{#if hasToolCalls && toolCallsHaveContents}
						<ToolCalls toolCalls={(message as AIMessage).tool_calls} />
					{:else if hasAnthropicToolCalls}
						<ToolCalls toolCalls={anthropicStreamedToolCalls} />
					{:else if hasToolCalls}
						<ToolCalls toolCalls={(message as AIMessage).tool_calls} />
					{/if}
				{/if}

				<!-- TODO: CustomComponent -->

				{#if isAgentInboxInterruptSchema(threadInterrupt?.value) && (isLastMessage || hasNoAIOrToolMessages)}
					<ThreadView interrupt={threadInterrupt.value} />
				{:else if threadInterrupt && !isAgentInboxInterruptSchema(threadInterrupt?.value) && isLastMessage}
					<GenericInterruptView interrupt={threadInterrupt.value} />
				{/if}
				<div
					class="mr-auto flex items-center gap-2 transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
				>
					<BranchSwitcher
						branch={meta?.branch}
						branchOptions={meta?.branchOptions}
						onSelect={(branch) => console.log('setBranch', branch)}
						{isLoading}
					/>
					<CommandBar
						content={contentString}
						{isLoading}
						isAiMessage={true}
						handleRegenerate={() => handleRegenerate(parentCheckpoint)}
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}
