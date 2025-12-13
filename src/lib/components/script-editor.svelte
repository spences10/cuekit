<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { scripts_state } from '$lib/state/scripts.svelte';

	let debounce_timer: ReturnType<typeof setTimeout> | null = null;

	function handle_title_change(e: Event) {
		const target = e.target as HTMLInputElement;
		if (scripts_state.current_id) {
			scripts_state.update(scripts_state.current_id, {
				title: target.value,
			});
		}
	}

	function handle_content_change(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		if (debounce_timer) clearTimeout(debounce_timer);
		debounce_timer = setTimeout(() => {
			if (scripts_state.current_id) {
				scripts_state.update(scripts_state.current_id, {
					content: target.value,
				});
			}
		}, 300);
	}

	function get_word_count(text: string): number {
		return text.trim() ? text.trim().split(/\s+/).length : 0;
	}
</script>

{#if scripts_state.current}
	<div class="flex h-full flex-col gap-4">
		<Input
			type="text"
			value={scripts_state.current.title}
			oninput={handle_title_change}
			placeholder="Script title"
			class="text-lg font-semibold"
		/>

		<div class="relative flex-1">
			<Textarea
				value={scripts_state.current.content}
				oninput={handle_content_change}
				placeholder="Start typing your script here...

Use ## Section Name to create navigation markers."
				class="h-full min-h-[400px] resize-none font-mono"
			/>
		</div>

		<div
			class="flex items-center justify-between text-sm text-muted-foreground"
		>
			<span
				>{get_word_count(scripts_state.current.content)} words</span
			>
			<span>{scripts_state.current.content.length} characters</span>
		</div>
	</div>
{:else}
	<div
		class="flex h-full items-center justify-center text-muted-foreground"
	>
		<p>Select or create a script to begin</p>
	</div>
{/if}
