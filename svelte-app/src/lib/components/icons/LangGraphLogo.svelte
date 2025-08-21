<script lang="ts">
	export let width: number | string | undefined = undefined;
	export let height: number | string | undefined = undefined;
	let className: string | undefined = undefined;
	export { className as class };
</script>

<svg
	{width}
	{height}
	class={className}
	viewBox="0 0 100 100"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...$$restProps}
>
	<g clip-path="url(#clip0_303_2)">
		<path
			d="M20.8333 50H37.5L45.8333 37.5L54.1667 62.5L62.5 50H79.1667"
			stroke="black"
			stroke-width="6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle cx="20.8333" cy="50" r="6.25" fill="black" />
		<circle cx="79.1667" cy="50" r="6.25" fill="black" />
		<circle cx="45.8333" cy="37.5" r="6.25" fill="black" />
		<circle cx="54.1667" cy="62.5" r="6.25" fill="black" />
	</g>
	<rect
		x="4.16667"
		y="4.16667"
		width="91.6667"
		height="91.6667"
		rx="14.5833"
		stroke="black"
		stroke-width="8.33333"
	/>
	<defs>
		<clipPath id="clip0_303_2">
			<rect width="100" height="100" fill="white" />
		</clipPath>
	</defs>
</svg>
