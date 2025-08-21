<script lang="ts">
	import { X, SendHorizontal, RefreshCcw, Pencil } from 'lucide-svelte';
	import TooltipIconButton from '../tooltip-icon-button.svelte';
	import ContentCopyable from './ContentCopyable.svelte';

	let {
		content,
		isHumanMessage,
		isAiMessage,
		isEditing,
		setIsEditing,
		handleSubmitEdit,
		handleRegenerate,
		isLoading,
	} = $props<{
		content: string;
		isHumanMessage?: boolean;
		isAiMessage?: boolean;
		isEditing?: boolean;
		setIsEditing?: (isEditing: boolean) => void;
		handleSubmitEdit?: () => void;
		handleRegenerate?: () => void;
		isLoading: boolean;
	}>();

	if (isHumanMessage && isAiMessage) {
		throw new Error(
			'Can only set one of isHumanMessage or isAiMessage to true, not both.'
		);
	}

	if (!isHumanMessage && !isAiMessage) {
		throw new Error(
			'One of isHumanMessage or isAiMessage must be set to true.'
		);
	}

	if (
		isHumanMessage &&
		(isEditing === undefined ||
			setIsEditing === undefined ||
			handleSubmitEdit === undefined)
	) {
		throw new Error(
			'If isHumanMessage is true, all of isEditing, setIsEditing, and handleSubmitEdit must be set.'
		);
	}

	const showEdit =
		isHumanMessage &&
		isEditing !== undefined &&
		!!setIsEditing &&
		!!handleSubmitEdit;
</script>

{#if isHumanMessage && isEditing && setIsEditing && handleSubmitEdit}
	<div class="flex items-center gap-2">
		<TooltipIconButton
			disabled={isLoading}
			tooltip="Cancel edit"
			variant="ghost"
			onclick={() => {
				setIsEditing(false);
			}}
		>
			<X />
		</TooltipIconButton>
		<TooltipIconButton
			disabled={isLoading}
			tooltip="Submit"
			variant="secondary"
			onclick={handleSubmitEdit}
		>
			<SendHorizontal />
		</TooltipIconButton>
	</div>
{:else}
	<div class="flex items-center gap-2">
		<ContentCopyable {content} disabled={isLoading} />
		{#if isAiMessage && handleRegenerate}
			<TooltipIconButton
				disabled={isLoading}
				tooltip="Refresh"
				variant="ghost"
				onclick={handleRegenerate}
			>
				<RefreshCcw />
			</TooltipIconButton>
		{/if}
		{#if showEdit && setIsEditing}
			<TooltipIconButton
				disabled={isLoading}
				tooltip="Edit"
				variant="ghost"
				onclick={() => {
					setIsEditing(true);
				}}
			>
				<Pencil />
			</TooltipIconButton>
		{/if}
	</div>
{/if}
