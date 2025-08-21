<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import ResetButton from './ResetButton.svelte';
	import ArgsRenderer from './ArgsRenderer.svelte';
	import type { HumanResponseWithEdits } from '../types';
	import type { HumanInterrupt } from '@langchain/langgraph/prebuilt';

	let {
		humanResponse,
		streaming,
		showArgsInResponse,
		interruptValue,
		onResponseChange,
		handleSubmit,
	} = $props<{
		humanResponse: HumanResponseWithEdits[];
		streaming: boolean;
		showArgsInResponse: boolean;
		interruptValue: HumanInterrupt;
		onResponseChange: (change: string, response: HumanResponseWithEdits) => void;
		handleSubmit: (e: MouseEvent | KeyboardEvent) => Promise<void>;
	}>();

	const res = humanResponse.find((r) => r.type === 'response');

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			handleSubmit(e);
		}
	}
</script>

{#if res && typeof res.args === 'string'}
	<div class="flex w-full flex-col items-start gap-4 rounded-xl border-[1px] border-gray-300 p-6">
		<div class="flex w-full items-center justify-between">
			<p class="text-base font-semibold text-black">Respond to assistant</p>
			<ResetButton handleReset={() => onResponseChange('', res)} />
		</div>

		{#if showArgsInResponse}
			<ArgsRenderer args={interruptValue.action_request.args} />
		{/if}

		<div class="flex w-full flex-col items-start gap-[6px]">
			<p class="min-w-fit text-sm font-medium">Response</p>
			<Textarea
				disabled={streaming}
				value={res.args}
				on:input={(e) => onResponseChange(e.currentTarget.value, res)}
				on:keydown={handleKeyDown}
				rows={4}
				placeholder="Your response here..."
			/>
		</div>

		<div class="flex w-full items-center justify-end gap-2">
			<Button variant="brand" disabled={streaming} on:click={handleSubmit}>
				Send Response
			</Button>
		</div>
	</div>
{/if}
