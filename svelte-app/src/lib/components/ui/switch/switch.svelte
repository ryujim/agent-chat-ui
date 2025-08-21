<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { switchVariants, switchThumbVariants } from "./index.js";

	type Props = SwitchPrimitive.Props;
	let { class: className, ...rest } = $props<Props>();
</script>

<SwitchPrimitive.Root
	class={cn(switchVariants(), className)}
	{...rest}
>
	<SwitchPrimitive.Thumb class={cn(switchThumbVariants())} />
</SwitchPrimitive.Root>
