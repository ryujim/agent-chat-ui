<script lang="ts">
  import { configStore } from '$lib/stores/config';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import LangGraphLogo from '$lib/components/icons/LangGraphLogo.svelte';
  import { ArrowRight } from 'lucide-svelte';

  let apiUrl = $configStore.apiUrl;
  let assistantId = $configStore.assistantId;
  let apiKey = $configStore.apiKey || '';

  function handleSubmit() {
    configStore.setConfig({
      apiUrl,
      assistantId,
      apiKey,
    });
  }
</script>

<div class="flex min-h-screen w-full items-center justify-center p-4">
  <div class="animate-in fade-in-0 zoom-in-95 bg-background flex max-w-3xl flex-col rounded-lg border shadow-lg">
    <div class="mt-14 flex flex-col gap-2 border-b p-6">
      <div class="flex flex-col items-start gap-2">
        <LangGraphLogo class="h-7" />
        <h1 class="text-xl font-semibold tracking-tight">
          Agent Chat
        </h1>
      </div>
      <p class="text-muted-foreground">
        Welcome to Agent Chat! Before you get started, you need to enter
        the URL of the deployment and the assistant / graph ID.
      </p>
    </div>
    <form on:submit|preventDefault={handleSubmit} class="bg-muted/50 flex flex-col gap-6 p-6">
      <div class="flex flex-col gap-2">
        <Label for="apiUrl">
          Deployment URL<span class="text-rose-500">*</span>
        </Label>
        <p class="text-muted-foreground text-sm">
          This is the URL of your LangGraph deployment. Can be a local, or
          production deployment.
        </p>
        <Input
          id="apiUrl"
          name="apiUrl"
          class="bg-background"
          bind:value={apiUrl}
          required
        />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="assistantId">
          Assistant / Graph ID<span class="text-rose-500">*</span>
        </Label>
        <p class="text-muted-foreground text-sm">
          This is the ID of the graph (can be the graph name), or
          assistant to fetch threads from, and invoke when actions are
          taken.
        </p>
        <Input
          id="assistantId"
          name="assistantId"
          class="bg-background"
          bind:value={assistantId}
          required
        />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="apiKey">LangSmith API Key</Label>
        <p class="text-muted-foreground text-sm">
          This is <strong>NOT</strong> required if using a local LangGraph
          server. This value is stored in your browser's local storage and
          is only used to authenticate requests sent to your LangGraph
          server.
        </p>
        <Input
          id="apiKey"
          name="apiKey"
          bind:value={apiKey}
          class="bg-background"
          placeholder="lsv2_pt_..."
        />
      </div>

      <div class="mt-2 flex justify-end">
        <Button
          type="submit"
          size="lg"
        >
          Continue
          <ArrowRight class="size-5" />
        </Button>
      </div>
    </form>
  </div>
</div>
