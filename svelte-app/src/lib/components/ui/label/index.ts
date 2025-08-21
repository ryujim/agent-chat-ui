import Root from "./label.svelte";
import { tv, type VariantProps } from "tailwind-variants";

export const labelVariants = tv({
	base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

export type Props = {
	class?: string;
	[key: string]: unknown;
};

export type Events = {
	[key: string]: unknown;
};

export { Root, Root as Label };
