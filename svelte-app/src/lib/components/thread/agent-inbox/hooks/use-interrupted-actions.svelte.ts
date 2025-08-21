import { $state, $effect } from 'svelte';
import { toast } from 'svelte-sonner';
import { getContext } from 'svelte';
import type { createStreamStore } from '$lib/stream-store.svelte';
import { createDefaultHumanResponse } from '../utils';
import type { HumanResponseWithEdits, SubmitType } from '../types';
import type { HumanInterrupt, HumanResponse } from '@langchain/langgraph/prebuilt';
import { END } from '@langchain/langgraph/web';

interface UseInterruptedActionsInput {
	interrupt: HumanInterrupt;
}

export function useInterruptedActions({ interrupt }: UseInterruptedActionsInput) {
	const streamStore = getContext<ReturnType<typeof createStreamStore>>('stream');
	const { submit } = streamStore;

	const state = $state({
		humanResponse: [] as HumanResponseWithEdits[],
		loading: false,
		streaming: false,
		streamFinished: false,
		selectedSubmitType: undefined as SubmitType | undefined,
		hasEdited: false,
		hasAddedResponse: false,
		acceptAllowed: false,
	});

	const initialHumanInterruptEditValue = { current: {} as Record<string, string> };

	$effect(() => {
		try {
			const { responses, defaultSubmitType, hasAccept } = createDefaultHumanResponse(
				interrupt,
				initialHumanInterruptEditValue
			);
			state.selectedSubmitType = defaultSubmitType;
			state.humanResponse = responses;
			state.acceptAllowed = hasAccept;
		} catch (e) {
			console.error('Error formatting and setting human response state', e);
		}
	});

	const resumeRun = (response: HumanResponse[]): boolean => {
		try {
			submit(
				{},
				{
					command: {
						resume: response
					}
				}
			);
			return true;
		} catch (e: any) {
			console.error('Error sending human response', e);
			return false;
		}
	};

	const handleSubmit = async (e: MouseEvent | KeyboardEvent) => {
		e.preventDefault();
		if (!state.humanResponse) {
			toast.error('Error', {
				description: 'Please enter a response.',
				duration: 5000,
			});
			return;
		}

		let errorOccurred = false;
		initialHumanInterruptEditValue.current = {};

		if (state.humanResponse.some((r) => ['response', 'edit', 'accept'].includes(r.type))) {
			state.streamFinished = false;

			try {
				const humanResponseInput: HumanResponse[] = state.humanResponse.flatMap((r) => {
					if (r.type === 'edit') {
						if (r.acceptAllowed && !r.editsMade) {
							return {
								type: 'accept',
								args: r.args
							};
						} else {
							return {
								type: 'edit',
								args: r.args
							};
						}
					}

					if (r.type === 'response' && !r.args) {
						return [];
					}
					return {
						type: r.type,
						args: r.args
					};
				});

				const input = humanResponseInput.find((r) => r.type === state.selectedSubmitType);
				if (!input) {
					toast.error('Error', {
						description: 'No response found.',
						duration: 5000,
					});
					return;
				}

				state.loading = true;
				state.streaming = true;
				const resumedSuccessfully = resumeRun([input]);
				if (!resumedSuccessfully) {
					return;
				}

				toast('Success', {
					description: 'Response submitted successfully.',
					duration: 5000
				});

				if (!errorOccurred) {
					state.streamFinished = true;
				}
			} catch (e: any) {
				console.error('Error sending human response', e);

				if ('message' in e && e.message.includes('Invalid assistant ID')) {
					toast('Error: Invalid assistant ID', {
						description:
							'The provided assistant ID was not found in this graph. Please update the assistant ID in the settings and try again.',
						duration: 5000,
					});
				} else {
					toast.error('Error', {
						description: 'Failed to submit response.',
						duration: 5000,
					});
				}

				errorOccurred = true;
				state.streaming = false;
				state.streamFinished = false;
			}

			if (!errorOccurred) {
				state.streaming = false;
				state.streamFinished = false;
			}
		} else {
			state.loading = true;
			resumeRun(state.humanResponse);

			toast('Success', {
				description: 'Response submitted successfully.',
				duration: 5000
			});
		}

		state.loading = false;
	};

	const handleIgnore = async (e: MouseEvent) => {
		e.preventDefault();

		const ignoreResponse = state.humanResponse.find((r) => r.type === 'ignore');
		if (!ignoreResponse) {
			toast.error('Error', {
				description: 'The selected thread does not support ignoring.',
				duration: 5000
			});
			return;
		}

		state.loading = true;
		initialHumanInterruptEditValue.current = {};

		resumeRun([ignoreResponse]);

		state.loading = false;
		toast('Successfully ignored thread', {
			duration: 5000
		});
	};

	const handleResolve = async (e: MouseEvent) => {
		e.preventDefault();

		state.loading = true;
		initialHumanInterruptEditValue.current = {};

		try {
			submit(
				{},
				{
					command: {
						goto: END
					}
				}
			);

			toast('Success', {
				description: 'Marked thread as resolved.',
				duration: 3000
			});
		} catch (e) {
			console.error('Error marking thread as resolved', e);
			toast.error('Error', {
				description: 'Failed to mark thread as resolved.',
				duration: 3000,
			});
		}

		state.loading = false;
	};

	const supportsMultipleMethods = $derived(
		state.humanResponse.filter((r) => r.type === 'edit' || r.type === 'accept' || r.type === 'response')
			.length > 1
	);

	return {
		state,
		handleSubmit,
		handleIgnore,
		handleResolve,
		supportsMultipleMethods,
		initialHumanInterruptEditValue
	};
}
