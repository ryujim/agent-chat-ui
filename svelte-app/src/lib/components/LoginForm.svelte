<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { LangGraphLogoSVG } from './icons/langgraph';
	import { ArrowRight } from 'lucide-svelte';

	let { handleSubmit, apiUrl, assistantId, apiKey } = $props();

	const DEFAULT_API_URL = 'http://localhost:2024';
	const DEFAULT_ASSISTANT_ID = 'agent';
</script>

<div class="flex min-h-screen w-full items-center justify-center p-4">
	<div class="animate-in fade-in-0 zoom-in-95 bg-background flex max-w-3xl flex-col rounded-lg border shadow-lg">
		<div class="mt-14 flex flex-col gap-2 border-b p-6">
			<div class="flex flex-col items-start gap-2">
				<LangGraphLogoSVG class="h-7" />
				<h1 class="text-xl font-semibold tracking-tight">Agent Chat</h1>
			</div>
			<p class="text-muted-foreground">
				Welcome to Agent Chat! Before you get started, you need to enter the URL of the deployment and the assistant / graph ID.
			</p>
		</div>
		<form onsubmit={handleSubmit} class="bg-muted/50 flex flex-col gap-6 p-6">
			<div class="flex flex-col gap-2">
				<Label for="apiUrl">
					Deployment URL<span class="text-rose-500">*</span>
				</Label>
				<p class="text-muted-foreground text-sm">
					This is the URL of your LangGraph deployment. Can be a local, or production deployment.
				</p>
				<Input
					id="apiUrl"
					name="apiUrl"
					class="bg-background"
					value={apiUrl || DEFAULT_API_URL}
					required
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="assistantId">
					Assistant / Graph ID<span class="text-rose-500">*</span>
				</Label>
				<p class="text-muted-foreground text-sm">
					This is the ID of the graph (can be the graph name), or assistant to fetch threads from, and invoke when actions are taken.
				</p>
				<Input
					id="assistantId"
					name="assistantId"
					class="bg-background"
					value={assistantId || DEFAULT_ASSISTANT_ID}
					required
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="apiKey">LangSmith API Key</Label>
				<p class="text-muted-foreground text-sm">
					This is <strong>NOT</strong> required if using a local LangGraph server. This value is stored in your browser's local storage and is only used to authenticate requests sent to your LangGraph server.
				</p>
				<Input
					id="apiKey"
					name="apiKey"
					value={apiKey ?? ''}
					class="bg-background"
					placeholder="lsv2_pt_..."
					type="password"
				/>
			</div>

			<div class="mt-2 flex justify-end">
				<Button type="submit" size="lg">
					Continue
					<ArrowRight class="size-5" />
				</Button>
			</div>
		</form>
	</div>
</div>
