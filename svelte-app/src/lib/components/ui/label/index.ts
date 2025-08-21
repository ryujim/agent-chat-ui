import Root from "./label.svelte";
import { tv, type VariantProps } from "tailwind-variants";

const labelVariants = tv({
	base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

export {
	Root,
	type VariantProps as LabelVariantProps,
	//
	Root as Label,
	labelVariants,
};
