<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$lib/components/ui/sheet';
	import { useMediaQuery } from '$lib/hooks/useMediaQuery.svelte';
	import type { createThreadStore } from '$lib/thread-store.svelte';
	import { PanelRightOpen, PanelRightClose } from 'lucide-svelte';
	import ThreadList from './ThreadList.svelte';
	import ThreadHistoryLoading from './ThreadHistoryLoading.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const threadStore = getContext<ReturnType<typeof createThreadStore>>('threads');
	const { state: threadState, getThreads } = threadStore;
	const isLargeScreen = useMediaQuery('(min-width: 1024px)');

	let chatHistoryOpen = $state(page.url.searchParams.get('chatHistoryOpen') === 'true');

	function setChatHistoryOpen(value: boolean) {
		const url = new URL(page.url);
		if (value) {
			url.searchParams.set('chatHistoryOpen', 'true');
		} else {
			url.searchParams.delete('chatHistoryOpen');
		}
		goto(url, { keepFocus: true, noScroll: true });
	}

	onMount(() => {
		getThreads();
	});

	$effect(() => {
		chatHistoryOpen = page.url.searchParams.get('chatHistoryOpen') === 'true';
	});
</script>

<div class="shadow-inner-right hidden h-screen w-[300px] shrink-0 flex-col items-start justify-start gap-6 border-r-[1px] border-slate-300 lg:flex">
    <div class="flex w-full items-center justify-between px-4 pt-1.5">
        <Button
            class="hover:bg-gray-100"
            variant="ghost"
            onclick={() => setChatHistoryOpen(!chatHistoryOpen)}
        >
            {#if chatHistoryOpen}
                <PanelRightOpen class="size-5" />
            {:else}
                <PanelRightClose class="size-5" />
            {/if}
        </Button>
        <h1 class="text-xl font-semibold tracking-tight">
            Thread History
        </h1>
    </div>
    {#if threadState.threadsLoading}
        <ThreadHistoryLoading />
    {:else}
        <ThreadList threads={threadState.threads} />
    {/if}
</div>
<div class="lg:hidden">
    <Sheet
        open={chatHistoryOpen && !$isLargeScreen}
        onOpenChange={(open) => {
            if (!$isLargeScreen) {
                setChatHistoryOpen(open);
            }
        }}
    >
        <SheetContent
            side="left"
            class="flex lg:hidden"
        >
            <SheetHeader>
                <SheetTitle>Thread History</SheetTitle>
            </SheetHeader>
            <ThreadList
                threads={threadState.threads}
                onThreadClick={() => setChatHistoryOpen(false)}
            />
        </SheetContent>
    </Sheet>
</div>
