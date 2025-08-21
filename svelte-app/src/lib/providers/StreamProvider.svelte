<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { getApiKey, setApiKey } from '$lib/api-key';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import StreamSession from './StreamSession.svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();

	// These are for the form, so they need to be writable state
	let formApiUrl = $state(env.PUBLIC_API_URL || '');
	let formAssistantId = $state(env.PUBLIC_ASSISTANT_ID || '');
	let formApiKey = $state(getApiKey() || '');

	// The actual values to use are derived from URL params or the form state
	const apiUrl = $derived(page.url.searchParams.get('apiUrl') || formApiUrl);
	const assistantId = $derived(page.url.searchParams.get('assistantId') || formAssistantId);
	const apiKey = $derived(formApiKey); // Only from form/localStorage

	function handleSubmit(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);
		const newApiUrl = formData.get('apiUrl') as string;
		const newAssistantId = formData.get('assistantId') as string;
		const newApiKey = formData.get('apiKey') as string;

		const url = new URL(page.url);
		url.searchParams.set('apiUrl', newApiUrl);
		url.searchParams.set('assistantId', newAssistantId);

		setApiKey(newApiKey);

		goto(url, { invalidateAll: true });
	}
</script>

{#if !apiUrl || !assistantId}
	<LoginForm {handleSubmit} apiUrl={formApiUrl} assistantId={formAssistantId} apiKey={formApiKey} />
{:else}
	<StreamSession {apiUrl} {apiKey} {assistantId}>
		{@render children()}
	</StreamSession>
{/if}
