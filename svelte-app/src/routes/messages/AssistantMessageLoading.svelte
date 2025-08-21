<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex items-start gap-2">
  <Skeleton class="h-8 w-8 rounded-full" />
  <div class="flex flex-col gap-2">
    <Skeleton class="h-6 w-24" />
    <Skeleton class="h-12 w-64" />
  </div>
</div>
