<script lang="ts">
	import { prompter_state } from '$lib/state/prompter.svelte';
	import { settings_state } from '$lib/state/settings.svelte';

	interface Props {
		content: string;
	}

	let { content }: Props = $props();

	let container = $state<HTMLDivElement | null>(null);
	let text_element = $state<HTMLDivElement | null>(null);

	$effect(() => {
		const c = container;
		const t = text_element;
		if (c && t) {
			// Update dimensions when content or font size changes
			const update_dimensions = () => {
				prompter_state.set_dimensions(t.scrollHeight, c.clientHeight);
			};

			update_dimensions();

			const observer = new ResizeObserver(update_dimensions);
			observer.observe(c);
			observer.observe(t);

			return () => observer.disconnect();
		}
	});

	// Parse content into lines, detecting markers
	function parse_content(
		text: string,
	): { type: 'text' | 'marker'; content: string }[] {
		return text.split('\n').map((line) => {
			if (line.startsWith('## ')) {
				return { type: 'marker' as const, content: line.slice(3) };
			}
			return { type: 'text' as const, content: line };
		});
	}

	const lines = $derived(parse_content(content));
</script>

<div
	bind:this={container}
	class="relative h-full w-full overflow-hidden"
	style:background-color={settings_state.data.background_opacity < 100
		? `rgba(0, 0, 0, ${settings_state.data.background_opacity / 100})`
		: settings_state.data.background_color}
	style:transform="scale({settings_state.data.flip_horizontal
		? -1
		: 1}, {settings_state.data.flip_vertical ? -1 : 1})"
>
	<!-- Reading guide -->
	{#if settings_state.data.show_guide}
		<div
			class="pointer-events-none absolute right-0 left-0 z-10 h-1"
			style:top="{settings_state.data.guide_position}%"
			style:background-color={settings_state.data.guide_color}
			style:opacity={settings_state.data.guide_opacity / 100}
		></div>
	{/if}

	<!-- Scrolling content -->
	<div
		bind:this={text_element}
		class="whitespace-pre-wrap"
		style:transform="translateY(-{prompter_state.position}px)"
		style:padding="{container?.clientHeight ?? 0}px 0"
		style:margin={settings_state.content_margin}
		style:font-size="{settings_state.data.font_size}px"
		style:font-family={settings_state.data.font_family}
		style:color={settings_state.data.text_color}
		style:line-height={settings_state.data.line_height}
		style:text-align={settings_state.data.text_align}
	>
		{#each lines as line}
			{#if line.type === 'marker'}
				<div class="my-4 border-l-4 border-current pl-4 opacity-70">
					{line.content}
				</div>
			{:else}
				<div>{line.content || '\u00A0'}</div>
			{/if}
		{/each}
	</div>
</div>
