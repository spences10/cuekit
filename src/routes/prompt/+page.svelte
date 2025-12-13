<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import ControlBar from '$lib/components/control-bar.svelte';
	import PrompterDisplay from '$lib/components/prompter-display.svelte';
	import { Button } from '$lib/components/ui/button';
	import { prompter_state } from '$lib/state/prompter.svelte';
	import { scripts_state } from '$lib/state/scripts.svelte';
	import { settings_state } from '$lib/state/settings.svelte';
	import Minimize from '@lucide/svelte/icons/minimize';
	import X from '@lucide/svelte/icons/x';

	let container: HTMLDivElement;
	let show_controls = $state(true);
	let hide_timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (browser && !scripts_state.current) {
			goto('/');
		}
	});

	$effect(() => {
		if (browser && container) {
			container.requestFullscreen?.().catch(() => {
				// Fullscreen not supported or denied
			});
		}
	});

	function handle_keydown(e: KeyboardEvent) {
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
			case 'Escape':
				exit_presentation();
				break;
		}
	}

	function handle_mousemove() {
		show_controls = true;
		if (hide_timer) clearTimeout(hide_timer);
		hide_timer = setTimeout(() => {
			if (prompter_state.playing) {
				show_controls = false;
			}
		}, 3000);
	}

	function exit_presentation() {
		if (document.fullscreenElement) {
			document.exitFullscreen?.();
		}
		goto('/');
	}

	function toggle_fullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen?.();
		} else {
			container?.requestFullscreen?.();
		}
	}
</script>

<svelte:window onkeydown={handle_keydown} />

<div
	bind:this={container}
	onmousemove={handle_mousemove}
	role="application"
	class="relative h-screen w-screen bg-black"
>
	{#if scripts_state.current}
		<PrompterDisplay content={scripts_state.current.content} />

		<!-- Floating controls -->
		<div
			class="absolute right-0 bottom-0 left-0 p-4 transition-opacity duration-300 {show_controls
				? 'opacity-100'
				: 'opacity-0'}"
		>
			<ControlBar minimal onFullscreen={toggle_fullscreen} />
		</div>

		<!-- Exit button -->
		<div
			class="absolute top-4 right-4 flex gap-2 transition-opacity duration-300 {show_controls
				? 'opacity-100'
				: 'opacity-0'}"
		>
			<Button
				variant="outline"
				size="icon"
				onclick={toggle_fullscreen}
			>
				<Minimize class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				onclick={exit_presentation}
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center text-white">
			<p>No script selected. Redirecting...</p>
		</div>
	{/if}
</div>
