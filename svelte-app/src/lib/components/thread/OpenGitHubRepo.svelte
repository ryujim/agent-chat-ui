<script lang="ts">
	import TooltipIconButton from './tooltip-icon-button.svelte';
	import GitHubSVG from '../icons/github.svelte';
</script>

<TooltipIconButton tooltip="Open GitHub repo" side="left">
	<a
		href="https://github.com/langchain-ai/agent-chat-ui"
		target="_blank"
		class="flex items-center justify-center"
	>
		<GitHubSVG width="24" height="24" />
	</a>
</TooltipIconButton>
