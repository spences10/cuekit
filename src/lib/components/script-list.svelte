<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { scripts_state } from '$lib/state/scripts.svelte';
	import Copy from '@lucide/svelte/icons/copy';
	import FileText from '@lucide/svelte/icons/file-text';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Upload from '@lucide/svelte/icons/upload';

	let file_input: HTMLInputElement;

	function format_date(iso: string): string {
		const date = new Date(iso);
		return date.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
		});
	}

	async function handle_import(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const content = await file.text();
		scripts_state.import_text(content, file.name);
		target.value = '';
	}
</script>

<div class="flex h-full flex-col gap-3">
	<div class="flex gap-2">
		<Button
			onclick={() => scripts_state.create()}
			size="sm"
			class="flex-1"
		>
			<Plus class="mr-1 h-4 w-4" />
			New
		</Button>
		<Button
			onclick={() => file_input.click()}
			variant="outline"
			size="sm"
		>
			<Upload class="h-4 w-4" />
		</Button>
		<input
			bind:this={file_input}
			type="file"
			accept=".txt,.md"
			onchange={handle_import}
			class="hidden"
		/>
	</div>

	<Input
		type="text"
		placeholder="Search scripts..."
		bind:value={scripts_state.search_query}
		class="h-8 text-sm"
	/>

	<ScrollArea class="flex-1">
		<div class="flex flex-col gap-1 pr-3">
			{#each scripts_state.filtered as script (script.id)}
				<div
					role="button"
					tabindex="0"
					onclick={() => scripts_state.select(script.id)}
					onkeydown={(e) =>
						e.key === 'Enter' && scripts_state.select(script.id)}
					class="group flex w-full cursor-pointer items-start gap-2 rounded-md p-2 text-left transition-colors hover:bg-accent {scripts_state.current_id ===
					script.id
						? 'bg-accent'
						: ''}"
				>
					<FileText
						class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
					/>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{script.title}</p>
						<p class="text-xs text-muted-foreground">
							{format_date(script.updated_at)}
						</p>
					</div>
					<div
						class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<button
							onclick={(e) => {
								e.stopPropagation();
								scripts_state.duplicate(script.id);
							}}
							class="rounded p-1 hover:bg-secondary"
							title="Duplicate"
						>
							<Copy class="h-3 w-3" />
						</button>
						{#if script.id !== 'demo'}
							<button
								onclick={(e) => {
									e.stopPropagation();
									scripts_state.delete(script.id);
								}}
								class="rounded p-1 hover:bg-destructive hover:text-white"
								title="Delete"
							>
								<Trash2 class="h-3 w-3" />
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</ScrollArea>
</div>
