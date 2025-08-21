<script lang="ts">
	import type { HumanResponseWithEdits, SubmitType } from '../types';
	import { Separator } from '$lib/components/ui/separator';
	import ResponseComponent from './ResponseComponent.svelte';
	import EditAndOrAcceptComponent from './EditAndOrAcceptComponent.svelte';
	import ArgsRenderer from './ArgsRenderer.svelte';
	import type { HumanInterrupt } from '@langchain/langgraph/prebuilt';
	import { haveArgsChanged } from '../utils';

	let {
		interruptValue,
		humanResponse,
		streaming,
		streamFinished,
		supportsMultipleMethods,
		acceptAllowed,
		hasEdited,
		hasAddedResponse,
		initialValues,
		setHumanResponse,
		setSelectedSubmitType,
		setHasEdited,
		setHasAddedResponse,
		handleSubmit,
	} = $props<{
		interruptValue: HumanInterrupt;
		humanResponse: HumanResponseWithEdits[];
		supportsMultipleMethods: boolean;
		acceptAllowed: boolean;
		hasEdited: boolean;
		hasAddedResponse: boolean;
		initialValues: Record<string, string>;
		streaming: boolean;
		streamFinished: boolean;
		setHumanResponse: (value: HumanResponseWithEdits[]) => void;
		setSelectedSubmitType: (value: SubmitType | undefined) => void;
		setHasEdited: (value: boolean) => void;
		setHasAddedResponse: (value: boolean) => void;
		handleSubmit: (e: MouseEvent | KeyboardEvent) => Promise<void>;
	}>();

	const isEditAllowed = interruptValue.config.allow_edit;
	const isResponseAllowed = interruptValue.config.allow_respond;
	const hasArgs = Object.entries(interruptValue.action_request.args).length > 0;
	const showArgsInResponse =
		hasArgs && !isEditAllowed && !acceptAllowed && isResponseAllowed;
	const showArgsOutsideActionCards =
		hasArgs && !showArgsInResponse && !isEditAllowed && !acceptAllowed;

	function onEditChange(
		change: string | string[],
		response: HumanResponseWithEdits,
		key: string | string[]
	) {
		let valuesChanged = true;
		if (typeof response.args === 'object') {
			const updatedArgs = { ...(response.args?.args || {}) };

			if (Array.isArray(change) && Array.isArray(key)) {
				change.forEach((value, index) => {
					if (index < key.length) {
						updatedArgs[key[index]] = value;
					}
				});
			} else {
				updatedArgs[key as string] = change as string;
			}

			const haveValuesChanged = haveArgsChanged(updatedArgs, initialValues);
			valuesChanged = haveValuesChanged;
		}

		if (!valuesChanged) {
			setHasEdited(false);
			if (acceptAllowed) {
				setSelectedSubmitType('accept');
			} else if (hasAddedResponse) {
				setSelectedSubmitType('response');
			}
		} else {
			setSelectedSubmitType('edit');
			setHasEdited(true);
		}

		setHumanResponse(
			humanResponse.map((p) => {
				if (
					p.type === response.type &&
					typeof p.args === 'object' &&
					p.args?.action === (response.args as any).action
				) {
					const newEdit: HumanResponseWithEdits = {
						type: response.type,
						args: {
							action: (response.args as any).action,
							args:
								Array.isArray(change) && Array.isArray(key)
									? {
											...(response.args as any).args,
											...Object.fromEntries(key.map((k, i) => [k, change[i]]))
									  }
									: {
											...(response.args as any).args,
											[key as string]: change as string
									  }
						}
					};
					if (p.acceptAllowed) {
						return {
							...newEdit,
							acceptAllowed: true,
							editsMade: valuesChanged
						};
					}
					return newEdit;
				}
				return p;
			})
		);
	}

	function onResponseChange(change: string, response: HumanResponseWithEdits) {
		if (!change) {
			setHasAddedResponse(false);
			if (hasEdited) {
				setSelectedSubmitType('edit');
			} else if (acceptAllowed) {
				setSelectedSubmitType('accept');
			}
		} else {
			setSelectedSubmitType('response');
			setHasAddedResponse(true);
		}

		setHumanResponse(
			humanResponse.map((p) => {
				if (p.type === response.type) {
					const newResponse: HumanResponseWithEdits = {
						type: response.type,
						args: change
					};
					if (p.acceptAllowed) {
						return {
							...newResponse,
							acceptAllowed: true,
							editsMade: !!change
						};
					}
					return newResponse;
				}
				return p;
			})
		);
	}
</script>

<div class="flex w-full flex-col items-start justify-start gap-2">
	{#if showArgsOutsideActionCards}
		<ArgsRenderer args={interruptValue.action_request.args} />
	{/if}

	<div class="flex w-full flex-col items-start gap-2">
		<EditAndOrAcceptComponent
			{humanResponse}
			{streaming}
			{initialValues}
			{interruptValue}
			{onEditChange}
			{handleSubmit}
		/>
		{#if supportsMultipleMethods}
			<div class="mx-auto mt-3 flex items-center gap-3">
				<Separator class="w-[full]" />
				<p class="text-sm text-gray-500">Or</p>
				<Separator class="w-full" />
			</div>
		{/if}
		<ResponseComponent
			{humanResponse}
			{streaming}
			{showArgsInResponse}
			{interruptValue}
			{onResponseChange}
			{handleSubmit}
		/>
		{#if streaming}
			<p class="text-sm text-gray-600">Running...</p>
		{/if}
		{#if streamFinished}
			<p class="text-base font-medium text-green-600">
				Successfully finished Graph invocation.
			</p>
		{/if}
	</div>
</div>
