<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	type Props = TooltipPrimitive.ProviderProps;
	let {
		delayDuration = 700,
		skipDelayDuration = 300,
		disableHoverableContent = undefined,
	} = $props<Props>();

</script>

<TooltipPrimitive.Provider
	{delayDuration}
	{skipDelayDuration}
	{disableHoverableContent}
>
	<slot />
</TooltipPrimitive.Provider>
