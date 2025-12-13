import { browser } from '$app/environment';

export interface Script {
	id: string;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
}

const STORAGE_KEY = 'cuekit_scripts';
const CURRENT_SCRIPT_KEY = 'cuekit_current_script';

const DEMO_SCRIPT: Script = {
	id: 'demo',
	title: 'Welcome to CueKit',
	content: `Welcome to CueKit, your professional web teleprompter.

This is a demo script to help you get started. Feel free to edit or delete it.

## Getting Started

Use the controls at the bottom to adjust:
- Playback speed (1-10)
- Font size
- Text color and background

## Keyboard Shortcuts

Press Space to play or pause.
Use Up/Down arrows to adjust speed.
Use Left/Right arrows to change font size.
Press R to reset to the beginning.
Press Escape to exit fullscreen.

## Creating Scripts

Click "New Script" to create your own.
Your scripts are saved automatically in your browser.

## Tips for Best Results

Keep sentences short and easy to read.
Use section markers (## like this) to create navigation points.
Practice with different speeds to find your rhythm.

Happy prompting!`,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

class ScriptsState {
	scripts = $state<Script[]>([]);
	current_id = $state<string | null>(null);
	search_query = $state('');

	current = $derived(
		this.scripts.find((s) => s.id === this.current_id) ?? null,
	);

	filtered = $derived(
		this.search_query
			? this.scripts.filter(
					(s) =>
						s.title
							.toLowerCase()
							.includes(this.search_query.toLowerCase()) ||
						s.content
							.toLowerCase()
							.includes(this.search_query.toLowerCase()),
				)
			: this.scripts,
	);

	constructor() {
		if (browser) {
			this.load();
		}
	}

	private load() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				this.scripts = JSON.parse(stored);
			} catch {
				this.scripts = [DEMO_SCRIPT];
			}
		} else {
			this.scripts = [DEMO_SCRIPT];
		}

		const current = localStorage.getItem(CURRENT_SCRIPT_KEY);
		if (current && this.scripts.some((s) => s.id === current)) {
			this.current_id = current;
		} else if (this.scripts.length > 0) {
			this.current_id = this.scripts[0].id;
		}
	}

	private save() {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scripts));
			if (this.current_id) {
				localStorage.setItem(CURRENT_SCRIPT_KEY, this.current_id);
			}
		}
	}

	create(title: string = 'Untitled Script') {
		const script: Script = {
			id: crypto.randomUUID(),
			title,
			content: '',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		this.scripts = [script, ...this.scripts];
		this.current_id = script.id;
		this.save();
		return script;
	}

	update(
		id: string,
		updates: Partial<Pick<Script, 'title' | 'content'>>,
	) {
		this.scripts = this.scripts.map((s) =>
			s.id === id
				? { ...s, ...updates, updated_at: new Date().toISOString() }
				: s,
		);
		this.save();
	}

	delete(id: string) {
		this.scripts = this.scripts.filter((s) => s.id !== id);
		if (this.current_id === id) {
			this.current_id = this.scripts[0]?.id ?? null;
		}
		this.save();
	}

	duplicate(id: string) {
		const source = this.scripts.find((s) => s.id === id);
		if (!source) return;

		const script: Script = {
			id: crypto.randomUUID(),
			title: `${source.title} (copy)`,
			content: source.content,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		this.scripts = [script, ...this.scripts];
		this.current_id = script.id;
		this.save();
	}

	select(id: string) {
		if (this.scripts.some((s) => s.id === id)) {
			this.current_id = id;
			this.save();
		}
	}

	import_text(content: string, filename: string) {
		const title = filename.replace(/\.(txt|md)$/i, '');
		const script = this.create(title);
		this.update(script.id, { content });
	}

	export_md(id: string): string {
		const script = this.scripts.find((s) => s.id === id);
		if (!script) return '';
		return `# ${script.title}\n\n${script.content}`;
	}
}

export const scripts_state = new ScriptsState();
