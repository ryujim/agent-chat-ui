<script lang="ts">
	import type { Message } from '@langchain/langgraph-sdk';
	import HumanMessage from './HumanMessage.svelte';
	import AssistantMessage from './AssistantMessage.svelte';
	import AssistantMessageLoading from './AssistantMessageLoading.svelte';
	import { DO_NOT_RENDER_ID_PREFIX } from '$lib/ensure-tool-responses';

	let { messages, isLoading, firstTokenReceived } = $props<{
		messages: Message[];
		isLoading: boolean;
		firstTokenReceived: boolean;
	}>();
</script>

<div class="pt-8 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full">
	{#each messages.filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX)) as message, index (message.id)}
		{#if message.type === 'human'}
			<HumanMessage {message} {isLoading} />
		{:else if message.type === 'ai'}
			<AssistantMessage message={message} {isLoading} handleRegenerate={() => {}} />
		{/if}
	{/each}
	{#if isLoading && !firstTokenReceived}
		<AssistantMessageLoading />
	{/if}
</div>
