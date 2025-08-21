<script lang="ts">
	import type { ToolCall } from '@langchain/core/messages/tool';
	import { unknownToPrettyDate } from '../utils';

	let { toolCall } = $props<{
		toolCall: ToolCall;
	}>();
</script>

<div class="max-w-full min-w-[300px] overflow-hidden rounded-lg border">
	<table class="w-full border-collapse">
		<thead>
			<tr>
				<th class="bg-gray-100 px-2 py-0 text-left text-sm" colSpan={2}>
					{toolCall.name}
				</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(toolCall.args) as [key, value]}
				{@const date = unknownToPrettyDate(value)}
				{@const valueStr =
					date ||
					(typeof value === 'string' || typeof value === 'number'
						? value.toString()
						: JSON.stringify(value, null))}
				<tr class="border-t">
					<td class="w-1/3 px-2 py-1 text-xs font-medium">{key}</td>
					<td class="px-2 py-1 font-mono text-xs">{valueStr}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
