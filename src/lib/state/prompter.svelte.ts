import { browser } from '$app/environment';

class PrompterState {
	playing = $state(false);
	speed = $state(5); // 1-10 scale
	position = $state(0); // pixels scrolled
	content_height = $state(0);
	viewport_height = $state(0);

	private animation_id: number | null = null;
	private last_time = 0;

	// Derived values
	progress = $derived(
		this.content_height > this.viewport_height
			? Math.min(
					100,
					(this.position /
						(this.content_height - this.viewport_height)) *
						100,
				)
			: 0,
	);

	at_end = $derived(
		this.content_height > 0 &&
			this.position >= this.content_height - this.viewport_height,
	);

	// Pixels per second based on speed (1-10)
	// Speed 1 = 20px/s, Speed 10 = 200px/s
	pixels_per_second = $derived(this.speed * 20);

	play() {
		if (this.playing || !browser) return;
		this.playing = true;
		this.last_time = performance.now();
		this.animate();
	}

	pause() {
		this.playing = false;
		if (this.animation_id !== null) {
			cancelAnimationFrame(this.animation_id);
			this.animation_id = null;
		}
	}

	toggle() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	reset() {
		this.pause();
		this.position = 0;
	}

	set_speed(value: number) {
		this.speed = Math.max(1, Math.min(10, value));
	}

	adjust_speed(delta: number) {
		this.set_speed(this.speed + delta);
	}

	seek(position: number) {
		this.position = Math.max(
			0,
			Math.min(position, this.content_height - this.viewport_height),
		);
	}

	seek_percent(percent: number) {
		const max_scroll = Math.max(
			0,
			this.content_height - this.viewport_height,
		);
		this.position = (percent / 100) * max_scroll;
	}

	set_dimensions(content_height: number, viewport_height: number) {
		this.content_height = content_height;
		this.viewport_height = viewport_height;
	}

	private animate() {
		if (!this.playing) return;

		const now = performance.now();
		const delta = (now - this.last_time) / 1000; // seconds
		this.last_time = now;

		const max_scroll = this.content_height - this.viewport_height;
		if (max_scroll > 0) {
			this.position = Math.min(
				this.position + this.pixels_per_second * delta,
				max_scroll,
			);

			if (this.position >= max_scroll) {
				this.pause();
				return;
			}
		}

		this.animation_id = requestAnimationFrame(() => this.animate());
	}

	// Estimate remaining time in seconds
	get remaining_time(): number {
		if (!this.playing && this.position === 0) {
			const max_scroll = this.content_height - this.viewport_height;
			return max_scroll > 0 ? max_scroll / this.pixels_per_second : 0;
		}
		const remaining =
			this.content_height - this.viewport_height - this.position;
		return remaining > 0 ? remaining / this.pixels_per_second : 0;
	}

	// Format time as MM:SS
	format_time(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
}

export const prompter_state = new PrompterState();
