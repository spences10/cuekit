<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { Slider } from '$lib/components/ui/slider';
	import {
		settings_state,
		type TextAlign,
	} from '$lib/state/settings.svelte';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignRight from '@lucide/svelte/icons/align-right';
	import FlipHorizontal from '@lucide/svelte/icons/flip-horizontal';
	import FlipVertical from '@lucide/svelte/icons/flip-vertical';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	const font_families = [
		{ value: 'system-ui, sans-serif', label: 'System' },
		{ value: 'Georgia, serif', label: 'Serif' },
		{ value: 'ui-monospace, monospace', label: 'Mono' },
	];

	function set_align(align: TextAlign) {
		settings_state.update('text_align', align);
	}
</script>

<div class="flex flex-col gap-6 p-4">
	<div>
		<h3 class="mb-3 text-sm font-medium">Font</h3>
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2">
				<span class="w-16 text-sm text-muted-foreground">Size</span>
				<Slider
					type="single"
					value={settings_state.data.font_size}
					onValueChange={(v: number) =>
						settings_state.update('font_size', v)}
					min={24}
					max={96}
					step={4}
					class="flex-1"
				/>
				<span class="w-8 text-right text-sm"
					>{settings_state.data.font_size}</span
				>
			</div>

			<div class="flex items-center gap-2">
				<span class="w-16 text-sm text-muted-foreground">Family</span>
				<Select.Root
					type="single"
					value={settings_state.data.font_family}
					onValueChange={(v) =>
						settings_state.update('font_family', v)}
				>
					<Select.Trigger class="flex-1">
						{font_families.find(
							(f) => f.value === settings_state.data.font_family,
						)?.label ?? 'System'}
					</Select.Trigger>
					<Select.Content>
						{#each font_families as font}
							<Select.Item value={font.value}
								>{font.label}</Select.Item
							>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-center gap-2">
				<span class="w-16 text-sm text-muted-foreground">Height</span>
				<Slider
					type="single"
					value={settings_state.data.line_height}
					onValueChange={(v: number) =>
						settings_state.update('line_height', v)}
					min={1}
					max={3}
					step={0.1}
					class="flex-1"
				/>
				<span class="w-8 text-right text-sm"
					>{settings_state.data.line_height.toFixed(1)}</span
				>
			</div>
		</div>
	</div>

	<Separator />

	<div>
		<h3 class="mb-3 text-sm font-medium">Alignment</h3>
		<div class="flex gap-2">
			<Button
				variant={settings_state.data.text_align === 'left'
					? 'default'
					: 'outline'}
				size="icon"
				onclick={() => set_align('left')}
			>
				<AlignLeft class="h-4 w-4" />
			</Button>
			<Button
				variant={settings_state.data.text_align === 'center'
					? 'default'
					: 'outline'}
				size="icon"
				onclick={() => set_align('center')}
			>
				<AlignCenter class="h-4 w-4" />
			</Button>
			<Button
				variant={settings_state.data.text_align === 'right'
					? 'default'
					: 'outline'}
				size="icon"
				onclick={() => set_align('right')}
			>
				<AlignRight class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<Separator />

	<div>
		<h3 class="mb-3 text-sm font-medium">Colors</h3>
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2">
				<span class="w-20 text-sm text-muted-foreground">Text</span>
				<Input
					type="color"
					value={settings_state.data.text_color}
					oninput={(e) =>
						settings_state.update(
							'text_color',
							e.currentTarget.value,
						)}
					class="h-8 w-16 p-1"
				/>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-20 text-sm text-muted-foreground"
					>Background</span
				>
				<Input
					type="color"
					value={settings_state.data.background_color}
					oninput={(e) =>
						settings_state.update(
							'background_color',
							e.currentTarget.value,
						)}
					class="h-8 w-16 p-1"
				/>
			</div>
		</div>
	</div>

	<Separator />

	<div>
		<h3 class="mb-3 text-sm font-medium">Reading Guide</h3>
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2">
				<Button
					variant={settings_state.data.show_guide
						? 'default'
						: 'outline'}
					size="sm"
					onclick={() => settings_state.toggle_guide()}
				>
					{settings_state.data.show_guide ? 'On' : 'Off'}
				</Button>
				<Input
					type="color"
					value={settings_state.data.guide_color}
					oninput={(e) =>
						settings_state.update(
							'guide_color',
							e.currentTarget.value,
						)}
					class="h-8 w-16 p-1"
					disabled={!settings_state.data.show_guide}
				/>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-16 text-sm text-muted-foreground"
					>Position</span
				>
				<Slider
					type="single"
					value={settings_state.data.guide_position}
					onValueChange={(v: number) =>
						settings_state.update('guide_position', v)}
					min={10}
					max={90}
					step={1}
					class="flex-1"
					disabled={!settings_state.data.show_guide}
				/>
				<span class="w-8 text-right text-sm"
					>{settings_state.data.guide_position}%</span
				>
			</div>
		</div>
	</div>

	<Separator />

	<div>
		<h3 class="mb-3 text-sm font-medium">Mirroring</h3>
		<div class="flex gap-2">
			<Button
				variant={settings_state.data.flip_horizontal
					? 'default'
					: 'outline'}
				size="icon"
				onclick={() => settings_state.toggle_flip_horizontal()}
			>
				<FlipHorizontal class="h-4 w-4" />
			</Button>
			<Button
				variant={settings_state.data.flip_vertical
					? 'default'
					: 'outline'}
				size="icon"
				onclick={() => settings_state.toggle_flip_vertical()}
			>
				<FlipVertical class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<Separator />

	<div>
		<h3 class="mb-3 text-sm font-medium">Margins</h3>
		<div class="flex items-center gap-2">
			<Slider
				type="single"
				value={settings_state.data.margin_percent}
				onValueChange={(v: number) =>
					settings_state.update('margin_percent', v)}
				min={0}
				max={40}
				step={5}
				class="flex-1"
			/>
			<span class="w-8 text-right text-sm"
				>{settings_state.data.margin_percent}%</span
			>
		</div>
	</div>

	<Separator />

	<Button
		variant="outline"
		onclick={() => settings_state.reset()}
		class="w-full"
	>
		<RotateCcw class="mr-2 h-4 w-4" />
		Reset to Defaults
	</Button>
</div>
