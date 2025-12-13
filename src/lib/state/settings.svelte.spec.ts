import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

vi.stubGlobal('localStorage', localStorageMock);

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true,
}));

const { settings_state } = await import('./settings.svelte');

describe('SettingsState', () => {
	beforeEach(() => {
		localStorageMock.clear();
		settings_state.reset();
		vi.clearAllMocks();
	});

	describe('default values', () => {
		it('should have default font size of 48', () => {
			expect(settings_state.data.font_size).toBe(48);
		});

		it('should have default font family as system', () => {
			expect(settings_state.data.font_family).toBe(
				'system-ui, sans-serif',
			);
		});

		it('should have white text on black background', () => {
			expect(settings_state.data.text_color).toBe('#ffffff');
			expect(settings_state.data.background_color).toBe('#000000');
		});

		it('should have centered text alignment', () => {
			expect(settings_state.data.text_align).toBe('center');
		});

		it('should have reading guide enabled by default', () => {
			expect(settings_state.data.show_guide).toBe(true);
		});

		it('should not have flipping enabled', () => {
			expect(settings_state.data.flip_horizontal).toBe(false);
			expect(settings_state.data.flip_vertical).toBe(false);
		});
	});

	describe('update', () => {
		it('should update a single setting', () => {
			settings_state.update('font_size', 64);
			expect(settings_state.data.font_size).toBe(64);
		});

		it('should save to localStorage', () => {
			settings_state.update('font_size', 72);
			expect(localStorageMock.setItem).toHaveBeenCalled();
		});
	});

	describe('set_font_size', () => {
		it('should set font size', () => {
			settings_state.set_font_size(60);
			expect(settings_state.data.font_size).toBe(60);
		});

		it('should clamp to minimum of 24', () => {
			settings_state.set_font_size(10);
			expect(settings_state.data.font_size).toBe(24);
		});

		it('should clamp to maximum of 96', () => {
			settings_state.set_font_size(120);
			expect(settings_state.data.font_size).toBe(96);
		});
	});

	describe('adjust_font_size', () => {
		it('should increase font size by delta', () => {
			settings_state.set_font_size(48);
			settings_state.adjust_font_size(4);
			expect(settings_state.data.font_size).toBe(52);
		});

		it('should decrease font size by delta', () => {
			settings_state.set_font_size(48);
			settings_state.adjust_font_size(-4);
			expect(settings_state.data.font_size).toBe(44);
		});

		it('should respect bounds when adjusting', () => {
			settings_state.set_font_size(24);
			settings_state.adjust_font_size(-10);
			expect(settings_state.data.font_size).toBe(24);

			settings_state.set_font_size(96);
			settings_state.adjust_font_size(10);
			expect(settings_state.data.font_size).toBe(96);
		});
	});

	describe('toggles', () => {
		it('should toggle flip_horizontal', () => {
			expect(settings_state.data.flip_horizontal).toBe(false);
			settings_state.toggle_flip_horizontal();
			expect(settings_state.data.flip_horizontal).toBe(true);
			settings_state.toggle_flip_horizontal();
			expect(settings_state.data.flip_horizontal).toBe(false);
		});

		it('should toggle flip_vertical', () => {
			expect(settings_state.data.flip_vertical).toBe(false);
			settings_state.toggle_flip_vertical();
			expect(settings_state.data.flip_vertical).toBe(true);
		});

		it('should toggle show_guide', () => {
			expect(settings_state.data.show_guide).toBe(true);
			settings_state.toggle_guide();
			expect(settings_state.data.show_guide).toBe(false);
		});
	});

	describe('reset', () => {
		it('should restore all default values', () => {
			settings_state.update('font_size', 72);
			settings_state.update('text_color', '#ff0000');
			settings_state.toggle_flip_horizontal();

			settings_state.reset();

			expect(settings_state.data.font_size).toBe(48);
			expect(settings_state.data.text_color).toBe('#ffffff');
			expect(settings_state.data.flip_horizontal).toBe(false);
		});
	});

	describe('computed styles', () => {
		it('should compute content_margin from margin_percent', () => {
			settings_state.update('margin_percent', 20);
			expect(settings_state.content_margin).toBe('0 20%');
		});
	});
});
