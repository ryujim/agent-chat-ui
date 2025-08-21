<script lang="ts">
	import type { Thread } from '@langchain/langgraph-sdk';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let {
		threads,
		onThreadClick,
	} = $props<{
		threads: Thread[];
		onThreadClick?: (threadId: string) => void;
	}>();

	function setThreadId(threadId: string) {
		const url = new URL(page.url);
		url.searchParams.set('threadId', threadId);
		goto(url, { invalidateAll: true });
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
	{#each threads as t (t.thread_id)}
		{@const firstMessage = Array.isArray(t.values?.messages) && t.values.messages.length > 0 ? t.values.messages[0] : null}
		{@const itemText = firstMessage ? (Array.isArray(firstMessage.content) ? firstMessage.content.find(c => c.type === 'text')?.text ?? t.thread_id : firstMessage.content) : t.thread_id}
		<div class="w-full px-1">
			<Button
				variant="ghost"
				class="w-[280px] items-start justify-start text-left font-normal"
				onclick={(e) => {
					e.preventDefault();
					onThreadClick?.(t.thread_id);
					if (t.thread_id === page.url.searchParams.get('threadId')) return;
					setThreadId(t.thread_id);
				}}
			>
				<p class="truncate text-ellipsis">{itemText}</p>
			</Button>
		</div>
	{/each}
</div>
