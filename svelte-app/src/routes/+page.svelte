<script lang="ts">
	import Thread from '$lib/components/thread/index.svelte';
	import StreamProvider from '$lib/providers/StreamProvider.svelte';
	import ThreadProvider from '$lib/providers/ThreadProvider.svelte';
	import ArtifactProvider from '$lib/providers/ArtifactProvider.svelte';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster />
<ThreadProvider>
	<StreamProvider>
		<ArtifactProvider>
			<Thread />
		</ArtifactProvider>
	</StreamProvider>
</ThreadProvider>
