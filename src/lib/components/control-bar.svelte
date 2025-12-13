<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { prompter_state } from '$lib/state/prompter.svelte';
	import { settings_state } from '$lib/state/settings.svelte';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Minus from '@lucide/svelte/icons/minus';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Settings from '@lucide/svelte/icons/settings';

	interface Props {
		onSettings?: () => void;
		onFullscreen?: () => void;
		minimal?: boolean;
	}

	let { onSettings, onFullscreen, minimal = false }: Props = $props();
</script>

<div
	class="flex items-center gap-4 rounded-lg border bg-card p-3 {minimal
		? 'bg-card/80 backdrop-blur'
		: ''}"
>
	<!-- Playback controls -->
	<div class="flex items-center gap-2">
		<Button
			variant="outline"
			size="icon"
			onclick={() => prompter_state.toggle()}
		>
			{#if prompter_state.playing}
				<Pause class="h-4 w-4" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
		<Button
			variant="outline"
			size="icon"
			onclick={() => prompter_state.reset()}
		>
			<RotateCcw class="h-4 w-4" />
		</Button>
	</div>

	<!-- Speed control -->
	<div class="flex items-center gap-2">
		<span class="text-sm text-muted-foreground">Speed</span>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => prompter_state.adjust_speed(-1)}
		>
			<Minus class="h-3 w-3" />
		</Button>
		<Slider
			type="single"
			value={prompter_state.speed}
			onValueChange={(v: number) => prompter_state.set_speed(v)}
			min={1}
			max={10}
			step={1}
			class="w-24"
		/>
		<span class="w-4 text-center text-sm">{prompter_state.speed}</span
		>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => prompter_state.adjust_speed(1)}
		>
			<Plus class="h-3 w-3" />
		</Button>
	</div>

	{#if !minimal}
		<!-- Font size control -->
		<div class="flex items-center gap-2">
			<span class="text-sm text-muted-foreground">Font</span>
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8"
				onclick={() => settings_state.adjust_font_size(-4)}
			>
				<Minus class="h-3 w-3" />
			</Button>
			<span class="w-8 text-center text-sm"
				>{settings_state.data.font_size}</span
			>
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8"
				onclick={() => settings_state.adjust_font_size(4)}
			>
				<Plus class="h-3 w-3" />
			</Button>
		</div>
	{/if}

	<!-- Progress and time -->
	<div
		class="flex flex-1 items-center justify-center gap-4 text-sm text-muted-foreground"
	>
		<span>{Math.round(prompter_state.progress)}%</span>
		<span
			>{prompter_state.format_time(prompter_state.remaining_time)} remaining</span
		>
	</div>

	<!-- Actions -->
	<div class="flex items-center gap-2">
		{#if onSettings}
			<Button variant="ghost" size="icon" onclick={onSettings}>
				<Settings class="h-4 w-4" />
			</Button>
		{/if}
		{#if onFullscreen}
			<Button variant="outline" size="icon" onclick={onFullscreen}>
				<Maximize class="h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>
