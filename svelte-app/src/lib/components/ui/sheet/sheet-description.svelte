<script lang="ts">
  import { Sheet as SheetPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";
  type $$Props = SheetPrimitive.DescriptionProps;
  let className: string | undefined = undefined;
  export { className as class };
</script>
<SheetPrimitive.Description
  class={cn("text-sm text-muted-foreground", className)}
  {...$$restProps}
>
  <slot />
</SheetPrimitive.Description>
