<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$lib/components/ui/sheet';
  import { threadStore } from '$lib/stores/thread';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getContentString } from '$lib/utils';
  import { PanelRightOpen, PanelRightClose } from 'lucide-svelte';

  // This is a simplified media query store. A more robust implementation
  // would use window.matchMedia and update on changes.
  let isLargeScreen = true;
  onMount(() => {
    isLargeScreen = window.innerWidth >= 1024;
    threadStore.getThreads();
  });

  let chatHistoryOpen = false;
  $: {
    const open = $page.url.searchParams.get('chatHistoryOpen') === 'true';
    if (chatHistoryOpen !== open) {
      chatHistoryOpen = open;
    }
  }

  function setChatHistoryOpen(value: boolean) {
    const url = new URL($page.url);
    url.searchParams.set('chatHistoryOpen', value.toString());
    goto(url, { keepData: true, noScroll: true });
  }

  function handleThreadClick(threadId: string) {
    const url = new URL($page.url);
    url.searchParams.set('threadId', threadId);
    goto(url, { keepData: true, noScroll: true });
    if (!isLargeScreen) {
      setChatHistoryOpen(false);
    }
  }
</script>

{#if isLargeScreen}
  <div class="shadow-inner-right hidden h-screen w-[300px] shrink-0 flex-col items-start justify-start gap-6 border-r-[1px] border-slate-300 lg:flex">
    <div class="flex w-full items-center justify-between px-4 pt-1.5">
      <Button
        class="hover:bg-gray-100"
        variant="ghost"
        on:click={() => setChatHistoryOpen(!chatHistoryOpen)}
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
    {#if $threadStore.isLoading}
      <div class="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {#each { length: 20 } as _, i}
          <Skeleton class="h-10 w-[280px]" />
        {/each}
      </div>
    {:else}
      <div class="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {#each $threadStore.threads as thread (thread.thread_id)}
          <div class="w-full px-1">
            <Button
              variant="ghost"
              class="w-[280px] items-start justify-start text-left font-normal"
              on:click={() => handleThreadClick(thread.thread_id)}
            >
              <p class="truncate text-ellipsis">
                {getContentString(thread.values?.messages?.[0]?.content ?? 'New Thread')}
              </p>
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <Sheet bind:open={chatHistoryOpen}>
    <SheetContent side="left" class="flex lg:hidden flex-col">
      <SheetHeader>
        <SheetTitle>Thread History</SheetTitle>
      </SheetHeader>
      <div class="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {#each $threadStore.threads as thread (thread.thread_id)}
          <div class="w-full px-1">
            <Button
              variant="ghost"
              class="w-full items-start justify-start text-left font-normal"
              on:click={() => handleThreadClick(thread.thread_id)}
            >
              <p class="truncate text-ellipsis">
                {getContentString(thread.values?.messages?.[0]?.content ?? 'New Thread')}
              </p>
            </Button>
          </div>
        {/each}
      </div>
    </SheetContent>
  </Sheet>
{/if}
