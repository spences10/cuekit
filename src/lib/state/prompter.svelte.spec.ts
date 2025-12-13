import { flushSync } from 'svelte';
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true,
}));

// Mock requestAnimationFrame
vi.stubGlobal(
	'requestAnimationFrame',
	vi.fn((cb) => {
		return setTimeout(cb, 16);
	}),
);
vi.stubGlobal(
	'cancelAnimationFrame',
	vi.fn((id) => clearTimeout(id)),
);
vi.stubGlobal('performance', { now: vi.fn(() => Date.now()) });

const { prompter_state } = await import('./prompter.svelte');

describe('PrompterState', () => {
	beforeEach(() => {
		prompter_state.reset();
		prompter_state.set_dimensions(1000, 500); // content height, viewport height
		vi.clearAllMocks();
	});

	afterEach(() => {
		prompter_state.pause();
	});

	describe('initial state', () => {
		it('should start paused', () => {
			expect(prompter_state.playing).toBe(false);
		});

		it('should start at position 0', () => {
			expect(prompter_state.position).toBe(0);
		});

		it('should have default speed of 5', () => {
			expect(prompter_state.speed).toBe(5);
		});
	});

	describe('play/pause', () => {
		it('should set playing to true on play', () => {
			prompter_state.play();
			expect(prompter_state.playing).toBe(true);
		});

		it('should set playing to false on pause', () => {
			prompter_state.play();
			prompter_state.pause();
			expect(prompter_state.playing).toBe(false);
		});

		it('should toggle between play and pause', () => {
			expect(prompter_state.playing).toBe(false);
			prompter_state.toggle();
			expect(prompter_state.playing).toBe(true);
			prompter_state.toggle();
			expect(prompter_state.playing).toBe(false);
		});
	});

	describe('reset', () => {
		it('should reset position to 0', () => {
			prompter_state.seek(100);
			prompter_state.reset();
			expect(prompter_state.position).toBe(0);
		});

		it('should pause playback', () => {
			prompter_state.play();
			prompter_state.reset();
			expect(prompter_state.playing).toBe(false);
		});
	});

	describe('speed control', () => {
		it('should set speed within bounds', () => {
			prompter_state.set_speed(7);
			expect(prompter_state.speed).toBe(7);
		});

		it('should clamp speed to minimum of 1', () => {
			prompter_state.set_speed(0);
			expect(prompter_state.speed).toBe(1);

			prompter_state.set_speed(-5);
			expect(prompter_state.speed).toBe(1);
		});

		it('should clamp speed to maximum of 10', () => {
			prompter_state.set_speed(15);
			expect(prompter_state.speed).toBe(10);
		});

		it('should adjust speed by delta', () => {
			prompter_state.set_speed(5);
			prompter_state.adjust_speed(2);
			expect(prompter_state.speed).toBe(7);

			prompter_state.adjust_speed(-3);
			expect(prompter_state.speed).toBe(4);
		});
	});

	describe('seek', () => {
		it('should set position within bounds', () => {
			prompter_state.seek(200);
			expect(prompter_state.position).toBe(200);
		});

		it('should clamp position to minimum of 0', () => {
			prompter_state.seek(-100);
			expect(prompter_state.position).toBe(0);
		});

		it('should clamp position to max scroll', () => {
			// max_scroll = content_height - viewport_height = 1000 - 500 = 500
			prompter_state.seek(1000);
			expect(prompter_state.position).toBe(500);
		});
	});

	describe('seek_percent', () => {
		it('should seek to percentage of max scroll', () => {
			// max_scroll = 500, 50% = 250
			prompter_state.seek_percent(50);
			expect(prompter_state.position).toBe(250);
		});

		it('should seek to start at 0%', () => {
			prompter_state.seek_percent(0);
			expect(prompter_state.position).toBe(0);
		});

		it('should seek to end at 100%', () => {
			prompter_state.seek_percent(100);
			expect(prompter_state.position).toBe(500);
		});
	});

	describe('progress', () => {
		it('should be 0 at start', () => {
			flushSync(() => {
				prompter_state.seek(0);
			});
			expect(prompter_state.progress).toBe(0);
		});

		it('should be 100 at end', () => {
			flushSync(() => {
				prompter_state.seek(500);
			});
			expect(prompter_state.progress).toBe(100);
		});

		it('should reflect current position', () => {
			flushSync(() => {
				prompter_state.seek(250);
			});
			expect(prompter_state.progress).toBe(50);
		});
	});

	describe('pixels_per_second', () => {
		it('should calculate speed as 20 * speed value', () => {
			flushSync(() => {
				prompter_state.set_speed(1);
			});
			expect(prompter_state.pixels_per_second).toBe(20);

			flushSync(() => {
				prompter_state.set_speed(5);
			});
			expect(prompter_state.pixels_per_second).toBe(100);

			flushSync(() => {
				prompter_state.set_speed(10);
			});
			expect(prompter_state.pixels_per_second).toBe(200);
		});
	});

	describe('format_time', () => {
		it('should format seconds as MM:SS', () => {
			expect(prompter_state.format_time(0)).toBe('0:00');
			expect(prompter_state.format_time(30)).toBe('0:30');
			expect(prompter_state.format_time(60)).toBe('1:00');
			expect(prompter_state.format_time(90)).toBe('1:30');
			expect(prompter_state.format_time(125)).toBe('2:05');
		});
	});
});
