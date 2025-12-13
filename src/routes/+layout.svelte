<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>CueKit - Web Teleprompter</title>
	<meta
		name="description"
		content="Professional web-based teleprompter with smooth scrolling"
	/>
</svelte:head>

<div class="dark">
	{@render children()}
</div>
