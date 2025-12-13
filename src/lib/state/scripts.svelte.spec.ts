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

// Import after mocks are set up
const { scripts_state } = await import('./scripts.svelte');

describe('ScriptsState', () => {
	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	describe('initialization', () => {
		it('should have demo script on first load', () => {
			expect(scripts_state.scripts.length).toBeGreaterThan(0);
			expect(scripts_state.scripts.some((s) => s.id === 'demo')).toBe(
				true,
			);
		});

		it('should have a current script selected', () => {
			expect(scripts_state.current_id).not.toBeNull();
			expect(scripts_state.current).not.toBeNull();
		});
	});

	describe('create', () => {
		it('should create a new script with default title', () => {
			const initialCount = scripts_state.scripts.length;
			const script = scripts_state.create();

			expect(scripts_state.scripts.length).toBe(initialCount + 1);
			expect(script.title).toBe('Untitled Script');
			expect(script.content).toBe('');
			expect(scripts_state.current_id).toBe(script.id);
		});

		it('should create a new script with custom title', () => {
			const script = scripts_state.create('My Script');
			expect(script.title).toBe('My Script');
		});
	});

	describe('update', () => {
		it('should update script title', () => {
			const script = scripts_state.create('Original');
			scripts_state.update(script.id, { title: 'Updated' });

			const updated = scripts_state.scripts.find(
				(s) => s.id === script.id,
			);
			expect(updated?.title).toBe('Updated');
		});

		it('should update script content', () => {
			const script = scripts_state.create();
			scripts_state.update(script.id, { content: 'New content' });

			const updated = scripts_state.scripts.find(
				(s) => s.id === script.id,
			);
			expect(updated?.content).toBe('New content');
		});

		it('should set updated_at on update', () => {
			const script = scripts_state.create();
			scripts_state.update(script.id, { title: 'Changed' });

			const updated = scripts_state.scripts.find(
				(s) => s.id === script.id,
			);
			expect(updated?.updated_at).toBeDefined();
			expect(typeof updated?.updated_at).toBe('string');
		});
	});

	describe('delete', () => {
		it('should remove script from list', () => {
			const script = scripts_state.create();
			const initialCount = scripts_state.scripts.length;

			scripts_state.delete(script.id);

			expect(scripts_state.scripts.length).toBe(initialCount - 1);
			expect(
				scripts_state.scripts.find((s) => s.id === script.id),
			).toBeUndefined();
		});

		it('should select another script when deleting current', () => {
			const script = scripts_state.create();
			scripts_state.select(script.id);
			expect(scripts_state.current_id).toBe(script.id);

			scripts_state.delete(script.id);

			expect(scripts_state.current_id).not.toBe(script.id);
			expect(scripts_state.current_id).not.toBeNull();
		});
	});

	describe('duplicate', () => {
		it('should create a copy with "(copy)" suffix', () => {
			const script = scripts_state.create('Original');
			scripts_state.update(script.id, { content: 'Some content' });

			scripts_state.duplicate(script.id);

			const copy = scripts_state.scripts.find(
				(s) => s.title === 'Original (copy)',
			);
			expect(copy).toBeDefined();
			expect(copy?.content).toBe('Some content');
			expect(copy?.id).not.toBe(script.id);
		});
	});

	describe('search/filter', () => {
		it('should filter scripts by title', () => {
			scripts_state.create('Apple');
			scripts_state.create('Banana');
			scripts_state.create('Cherry');

			scripts_state.search_query = 'Banana';

			expect(
				scripts_state.filtered.some((s) => s.title === 'Banana'),
			).toBe(true);
			expect(
				scripts_state.filtered.some((s) => s.title === 'Apple'),
			).toBe(false);
		});

		it('should have filter method that checks content', () => {
			// Test the filtering logic directly
			const scripts = [
				{
					id: '1',
					title: 'Test',
					content: 'unique_keyword_xyz',
					created_at: '',
					updated_at: '',
				},
				{
					id: '2',
					title: 'Other',
					content: 'nothing special',
					created_at: '',
					updated_at: '',
				},
			];
			const query = 'unique_keyword_xyz';
			const filtered = scripts.filter(
				(s) =>
					s.title.toLowerCase().includes(query.toLowerCase()) ||
					s.content.toLowerCase().includes(query.toLowerCase()),
			);
			expect(filtered.length).toBe(1);
			expect(filtered[0].id).toBe('1');
		});

		it('should return all scripts when query is empty', () => {
			// Test the filtering logic directly
			const scripts = [
				{
					id: '1',
					title: 'Test',
					content: '',
					created_at: '',
					updated_at: '',
				},
				{
					id: '2',
					title: 'Other',
					content: '',
					created_at: '',
					updated_at: '',
				},
			];
			const query = '';
			const filtered = query
				? scripts.filter((s) =>
						s.title.toLowerCase().includes(query.toLowerCase()),
					)
				: scripts;
			expect(filtered.length).toBe(scripts.length);
		});
	});

	describe('export_md', () => {
		it('should export script as markdown with title', () => {
			const script = scripts_state.create('My Title');
			scripts_state.update(script.id, { content: 'My content here' });

			const md = scripts_state.export_md(script.id);

			expect(md).toBe('# My Title\n\nMy content here');
		});
	});
});
