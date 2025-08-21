<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { labelVariants, type Props } from "./index.js";
	import { cn } from "$lib/utils.js";

	let className = undefined;
	export { className as class };
	export let props = {};
</script>

<LabelPrimitive.Root
	{...props}
	class={cn(labelVariants(), className)}
	{...$$restProps}
>
	<slot />
</LabelPrimitive.Root>
