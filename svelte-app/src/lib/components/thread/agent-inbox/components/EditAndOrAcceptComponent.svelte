<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import ResetButton from './ResetButton.svelte';
	import { prettifyText } from '../utils';
	import type { HumanResponseWithEdits } from '../types';
	import type { HumanInterrupt } from '@langchain/langgraph/prebuilt';
	import AcceptComponent from './AcceptComponent.svelte';

	let {
		humanResponse,
		streaming,
		initialValues,
		onEditChange,
		handleSubmit,
		interruptValue,
	} = $props<{
		humanResponse: HumanResponseWithEdits[];
		streaming: boolean;
		initialValues: Record<string, string>;
		interruptValue: HumanInterrupt;
		onEditChange: (
			text: string | string[],
			response: HumanResponseWithEdits,
			key: string | string[]
		) => void;
		handleSubmit: (e: MouseEvent | KeyboardEvent) => Promise<void>;
	}>();

	const defaultRows = {} as Record<string, number>;
	const editResponse = humanResponse.find((r) => r.type === 'edit');
	const acceptResponse = humanResponse.find((r) => r.type === 'accept');

	const header = $derived(editResponse?.acceptAllowed ? 'Edit/Accept' : 'Edit');
	const buttonText = $derived(
		editResponse?.acceptAllowed && !editResponse.editsMade ? 'Accept' : 'Submit'
	);

	function handleReset() {
		if (
			!editResponse ||
			typeof editResponse.args !== 'object' ||
			!editResponse.args ||
			!(editResponse.args as any).args
		) {
			return;
		}
		const keysToReset: string[] = [];
		const valuesToReset: string[] = [];
		Object.entries(initialValues).forEach(([k, v]) => {
			if (k in (editResponse.args as Record<string, any>).args) {
				const value = ['string', 'number'].includes(typeof v) ? v : JSON.stringify(v, null, 2);
				keysToReset.push(k);
				valuesToReset.push(value);
			}
		});

		if (keysToReset.length > 0 && valuesToReset.length > 0) {
			onEditChange(valuesToReset, editResponse, keysToReset);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			handleSubmit(e);
		}
	}
</script>

{#if !editResponse || typeof editResponse.args !== 'object' || !editResponse.args}
	{#if acceptResponse}
		<AcceptComponent
			actionRequestArgs={interruptValue.action_request.args}
			{streaming}
			{handleSubmit}
		/>
	{/if}
{:else}
	<div class="flex w-full flex-col items-start gap-4 rounded-lg border-[1px] border-gray-300 p-6">
		<div class="flex w-full items-center justify-between">
			<p class="text-base font-semibold text-black">{header}</p>
			<ResetButton {handleReset} />
		</div>

		{#each Object.entries((editResponse.args as any).args) as [k, v], idx}
			{@const value = ['string', 'number'].includes(typeof v) ? v : JSON.stringify(v, null, 2)}
			{@const numRows = defaultRows[k] === undefined ? (!String(v).length ? 3 : Math.max(String(v).length / 30, 7)) : defaultRows[k]}
			<div class="flex h-full w-full flex-col items-start gap-1 px-[1px]">
				<div class="flex w-full flex-col items-start gap-[6px]">
					<p class="min-w-fit text-sm font-medium">{prettifyText(k)}</p>
					<Textarea
						disabled={streaming}
						class="h-full"
						value={String(value)}
						on:input={(e) => onEditChange(e.currentTarget.value, editResponse, k)}
						on:keydown={handleKeyDown}
						rows={numRows}
					/>
				</div>
			</div>
		{/each}

		<div class="flex w-full items-center justify-end gap-2">
			<Button variant="brand" disabled={streaming} on:click={handleSubmit}>
				{buttonText}
			</Button>
		</div>
	</div>
{/if}
