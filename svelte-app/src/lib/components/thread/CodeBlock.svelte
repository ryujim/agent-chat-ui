<script lang="ts">
	import Prism from 'svelte-prism';
	import CodeHeader from './messages/CodeHeader.svelte';

	let { lang, code } = $props<{
		lang: string;
		code: string;
	}>();
</script>

<div class="code-block">
	<CodeHeader {lang} {code} />
	<Prism language={lang} source={code} />
</div>
