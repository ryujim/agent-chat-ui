<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { labelVariants } from "./index.js";

	type Props = LabelPrimitive.Props;
	let { class: className, ...rest } = $props<Props>();
</script>

<LabelPrimitive.Root class={cn(labelVariants(), className)} {...rest}>
	<slot />
</LabelPrimitive.Root>
