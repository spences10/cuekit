import { browser } from '$app/environment';

export type TextAlign = 'left' | 'center' | 'right';

export interface Settings {
	font_size: number; // 24-96
	font_family: string;
	text_color: string;
	background_color: string;
	line_height: number; // 1-3
	text_align: TextAlign;
	margin_percent: number; // 0-40 (percentage of width for margins)
	show_guide: boolean;
	guide_position: number; // 0-100 (percentage from top)
	guide_color: string;
	guide_opacity: number; // 0-100
	flip_horizontal: boolean;
	flip_vertical: boolean;
	background_opacity: number; // 0-100
}

const STORAGE_KEY = 'cuekit_settings';

const DEFAULT_SETTINGS: Settings = {
	font_size: 48,
	font_family: 'system-ui, sans-serif',
	text_color: '#ffffff',
	background_color: '#000000',
	line_height: 1.6,
	text_align: 'center',
	margin_percent: 10,
	show_guide: true,
	guide_position: 33,
	guide_color: '#ff0000',
	guide_opacity: 50,
	flip_horizontal: false,
	flip_vertical: false,
	background_opacity: 100,
};

class SettingsState {
	data = $state<Settings>({ ...DEFAULT_SETTINGS });

	// Computed style object for prompter display
	text_style = $derived({
		fontSize: `${this.data.font_size}px`,
		fontFamily: this.data.font_family,
		color: this.data.text_color,
		lineHeight: this.data.line_height,
		textAlign: this.data.text_align as string,
	});

	container_style = $derived({
		backgroundColor:
			this.data.background_opacity < 100
				? `rgba(0, 0, 0, ${this.data.background_opacity / 100})`
				: this.data.background_color,
		transform: `scale(${this.data.flip_horizontal ? -1 : 1}, ${this.data.flip_vertical ? -1 : 1})`,
	});

	guide_style = $derived({
		top: `${this.data.guide_position}%`,
		backgroundColor: this.data.guide_color,
		opacity: this.data.guide_opacity / 100,
	});

	content_margin = $derived(`0 ${this.data.margin_percent}%`);

	constructor() {
		if (browser) {
			this.load();
		}
	}

	private load() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				this.data = { ...DEFAULT_SETTINGS, ...parsed };
			} catch {
				this.data = { ...DEFAULT_SETTINGS };
			}
		}
	}

	private save() {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
		}
	}

	update<K extends keyof Settings>(key: K, value: Settings[K]) {
		this.data = { ...this.data, [key]: value };
		this.save();
	}

	set_font_size(size: number) {
		this.update('font_size', Math.max(24, Math.min(96, size)));
	}

	adjust_font_size(delta: number) {
		this.set_font_size(this.data.font_size + delta);
	}

	toggle_flip_horizontal() {
		this.update('flip_horizontal', !this.data.flip_horizontal);
	}

	toggle_flip_vertical() {
		this.update('flip_vertical', !this.data.flip_vertical);
	}

	toggle_guide() {
		this.update('show_guide', !this.data.show_guide);
	}

	reset() {
		this.data = { ...DEFAULT_SETTINGS };
		this.save();
	}
}

export const settings_state = new SettingsState();
