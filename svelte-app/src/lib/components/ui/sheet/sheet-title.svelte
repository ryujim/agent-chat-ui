<script lang="ts">
  import { Sheet as SheetPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";
  type $$Props = SheetPrimitive.TitleProps;
  let className: string | undefined = undefined;
  export { className as class };
</script>
<SheetPrimitive.Title
  class={cn("text-lg font-semibold text-foreground", className)}
  {...$$restProps}
>
  <slot />
</SheetPrimitive.Title>
