<script lang="ts">
  import { marked } from 'marked';

  export let content: string;

  let htmlContent: string;
  $: {
    (async () => {
      htmlContent = await marked.parse(content);
    })();
  }
</script>

<div class="prose">
  {@html htmlContent}
</div>
