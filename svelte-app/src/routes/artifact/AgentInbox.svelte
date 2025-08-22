<script lang="ts">
  export let props: any;
</script>

<div class="p-4">
  <h2 class="text-lg font-semibold">Agent Inbox</h2>
  <pre>{JSON.stringify(props, null, 2)}</pre>
</div>
