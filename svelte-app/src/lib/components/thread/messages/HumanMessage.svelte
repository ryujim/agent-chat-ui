<script lang="ts">
	import type { Message } from '@langchain/langgraph-sdk';
	import { getContext } from 'svelte';
	import type { createStreamStore } from '$lib/stream-store.svelte';
	import { cn } from '$lib/utils';
	import { Textarea } from '$lib/components/ui/textarea';
	import BranchSwitcher from './BranchSwitcher.svelte';
	import CommandBar from './CommandBar.svelte';
	import MultimodalPreview from '../MultimodalPreview.svelte';
	import { isBase64ContentBlock } from '$lib/multimodal-utils';

	let {
		message,
		isLoading,
	} = $props<{
		message: Message;
		isLoading: boolean;
	}>();

	const streamStore = getContext<ReturnType<typeof createStreamStore>>('stream');
	const { submit } = streamStore;

	// TODO: Get message metadata and parent checkpoint
	const meta = undefined;
	const parentCheckpoint = undefined;

	let isEditing = $state(false);

	const contentString = $derived(
		Array.isArray(message.content)
			? message.content.find((c) => c.type === 'text')?.text ?? ''
			: message.content
	);

	let value = $state(contentString);

	function handleSubmitEdit() {
		isEditing = false;
		const newMessage: Message = { type: 'human', content: value };
		// TODO: Handle optimistic updates
		submit({ messages: [newMessage] });
	}
</script>

<div class={cn('group ml-auto flex items-center gap-2', isEditing && 'w-full max-w-xl')}>
	<div class={cn('flex flex-col gap-2', isEditing && 'w-full')}>
		{#if isEditing}
			<Textarea
				bind:value
				on:keydown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
						e.preventDefault();
						handleSubmitEdit();
					}
				}}
				class="focus-visible:ring-0"
			/>
		{:else}
			<div class="flex flex-col gap-2">
				{#if Array.isArray(message.content) && message.content.length > 0}
					<div class="flex flex-wrap items-end justify-end gap-2">
						{#each message.content as block, idx (block)}
							{#if isBase64ContentBlock(block)}
								<MultimodalPreview {block} size="md" />
							{/if}
						{/each}
					</div>
				{/if}
				{#if contentString}
					<p class="bg-muted ml-auto w-fit rounded-3xl px-4 py-2 text-right whitespace-pre-wrap">
						{contentString}
					</p>
				{/if}
			</div>
		{/if}

		<div class={cn('ml-auto flex items-center gap-2 transition-opacity', 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100', isEditing && 'opacity-100')}>
			<BranchSwitcher
				branch={meta?.branch}
				branchOptions={meta?.branchOptions}
				onSelect={(branch) => console.log('setBranch', branch)}
				{isLoading}
			/>
			<CommandBar
				content={contentString}
				{isEditing}
				setIsEditing={(editing) => {
					if (editing) {
						value = contentString;
					}
					isEditing = editing;
				}}
				{handleSubmitEdit}
				isHumanMessage={true}
				{isLoading}
			/>
		</div>
	</div>
</div>
