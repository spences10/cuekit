<script lang="ts">
	import { goto } from '$app/navigation';
	import ControlBar from '$lib/components/control-bar.svelte';
	import PrompterDisplay from '$lib/components/prompter-display.svelte';
	import ScriptEditor from '$lib/components/script-editor.svelte';
	import ScriptList from '$lib/components/script-list.svelte';
	import SettingsPanel from '$lib/components/settings-panel.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { prompter_state } from '$lib/state/prompter.svelte';
	import { scripts_state } from '$lib/state/scripts.svelte';
	import { settings_state } from '$lib/state/settings.svelte';
	import Download from '@lucide/svelte/icons/download';
	import Eye from '@lucide/svelte/icons/eye';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Pencil from '@lucide/svelte/icons/pencil';

	let show_sidebar = $state(true);
	let show_settings = $state(false);
	let mode = $state<'edit' | 'preview'>('edit');

	function handle_keydown(e: KeyboardEvent) {
		// Don't handle if typing in input
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement
		) {
			return;
		}

		switch (e.code) {
			case 'Space':
				e.preventDefault();
				prompter_state.toggle();
				break;
			case 'ArrowUp':
				e.preventDefault();
				prompter_state.adjust_speed(1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				prompter_state.adjust_speed(-1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				settings_state.adjust_font_size(-4);
				break;
			case 'ArrowRight':
				e.preventDefault();
				settings_state.adjust_font_size(4);
				break;
			case 'KeyR':
				e.preventDefault();
				prompter_state.reset();
				break;
		}
	}

	function export_script() {
		if (!scripts_state.current) return;
		const md = scripts_state.export_md(scripts_state.current.id);
		const blob = new Blob([md], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${scripts_state.current.title}.md`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function go_fullscreen() {
		goto('/prompt');
	}
</script>

<svelte:window onkeydown={handle_keydown} />

<div class="flex h-screen flex-col bg-background text-foreground">
	<!-- Header -->
	<header
		class="flex items-center justify-between border-b px-4 py-2"
	>
		<div class="flex items-center gap-2">
			<Button
				variant="ghost"
				size="icon"
				onclick={() => (show_sidebar = !show_sidebar)}
			>
				<PanelLeft class="h-5 w-5" />
			</Button>
			<h1 class="text-xl font-bold">CueKit</h1>
		</div>

		<div class="flex items-center gap-2">
			<Button
				variant={mode === 'edit' ? 'default' : 'ghost'}
				size="sm"
				onclick={() => (mode = 'edit')}
			>
				<Pencil class="mr-1 h-4 w-4" />
				Edit
			</Button>
			<Button
				variant={mode === 'preview' ? 'default' : 'ghost'}
				size="sm"
				onclick={() => (mode = 'preview')}
			>
				<Eye class="mr-1 h-4 w-4" />
				Preview
			</Button>
			{#if scripts_state.current}
				<Button
					variant="ghost"
					size="icon"
					onclick={export_script}
					title="Export as Markdown"
				>
					<Download class="h-4 w-4" />
				</Button>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		{#if show_sidebar}
			<aside class="w-64 shrink-0 border-r p-4">
				<ScriptList />
			</aside>
		{/if}

		<!-- Content area -->
		<main class="flex flex-1 flex-col overflow-hidden">
			{#if mode === 'edit'}
				<div class="flex-1 overflow-auto p-4">
					<ScriptEditor />
				</div>
			{:else if scripts_state.current}
				<div class="flex-1 overflow-hidden">
					<PrompterDisplay content={scripts_state.current.content} />
				</div>
				<div class="border-t p-4">
					<ControlBar
						onSettings={() => (show_settings = true)}
						onFullscreen={go_fullscreen}
					/>
				</div>
			{/if}
		</main>
	</div>
</div>

<!-- Settings Dialog -->
<Dialog.Root bind:open={show_settings}>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Display Settings</Dialog.Title>
			<Dialog.Description
				>Customize the teleprompter appearance</Dialog.Description
			>
		</Dialog.Header>
		<SettingsPanel />
	</Dialog.Content>
</Dialog.Root>
