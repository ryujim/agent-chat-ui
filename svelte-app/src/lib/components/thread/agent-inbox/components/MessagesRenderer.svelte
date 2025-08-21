<script lang="ts">
	import type { BaseMessage } from '@langchain/core/messages';
	import type { ToolCall } from '@langchain/core/messages/tool';
	import { messageTypeToLabel } from '../utils';
	import MarkdownText from '../../MarkdownText.svelte';
	import ToolCallTable from './ToolCallTable.svelte';

	let { messages } = $props<{
		messages: BaseMessage[];
	}>();
</script>

<div class="flex w-full flex-col gap-1">
	{#each messages as msg, idx (msg.id ?? `message-${idx}`)}
		{@const messageTypeLabel = messageTypeToLabel(msg)}
		{@const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null)}
		<div class="ml-2 flex w-full flex-col gap-[2px]">
			<p class="font-medium text-gray-700">{messageTypeLabel}:</p>
			{#if content}
				<MarkdownText source={content} />
			{/if}
			{#if 'tool_calls' in msg && msg.tool_calls}
				<div class="flex w-full flex-col items-start gap-1">
					{#each msg.tool_calls as tc, idx2 ((tc as ToolCall).id ?? `tool-call-${idx2}`)}
						<ToolCallTable toolCall={tc as ToolCall} />
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>
