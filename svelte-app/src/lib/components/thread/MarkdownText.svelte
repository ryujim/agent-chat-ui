<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import remarkGfm from 'remark-gfm';
	import remarkMath from 'remark-math';
	import rehypeKatex from 'rehype-katex';
	import CodeBlock from './CodeBlock.svelte';
	import 'prismjs/themes/prism-tomorrow.css';
	import './markdown-styles.css';

	let { source } = $props<{
		source: string;
	}>();

	const renderers = {
		code: CodeBlock,
	};
</script>

<div class="markdown-content">
	<SvelteMarkdown {source} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} {renderers} />
</div>
