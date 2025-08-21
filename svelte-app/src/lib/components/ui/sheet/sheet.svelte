<script lang="ts">
  import { Sheet as SheetPrimitive } from "bits-ui";

  type $$Props = SheetPrimitive.Props;

  let props: $$Props = $props();
</script>

<SheetPrimitive.Root {...props}>
  <slot />
</SheetPrimitive.Root>
