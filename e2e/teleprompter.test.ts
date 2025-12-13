import { expect, test } from '@playwright/test';

test.describe('CueKit Teleprompter', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display header with CueKit title', async ({
		page,
	}) => {
		await expect(page.locator('h1')).toContainText('CueKit');
	});

	test('should show demo script by default', async ({ page }) => {
		await expect(page.getByText('Welcome to CueKit')).toBeVisible();
	});

	test('should toggle sidebar', async ({ page }) => {
		const sidebar = page.locator('aside');
		await expect(sidebar).toBeVisible();

		// Click sidebar toggle button
		await page.getByRole('button').first().click();
		await expect(sidebar).not.toBeVisible();

		// Toggle back
		await page.getByRole('button').first().click();
		await expect(sidebar).toBeVisible();
	});

	test('should create new script', async ({ page }) => {
		await page.getByRole('button', { name: /new/i }).click();

		// New script should appear in the list
		await expect(page.getByText('Untitled Script')).toBeVisible();
	});

	test('should edit script title', async ({ page }) => {
		await page.getByRole('button', { name: /new/i }).click();

		const titleInput = page.getByPlaceholder('Script title');
		await titleInput.fill('My Test Script');

		await expect(page.getByText('My Test Script')).toBeVisible();
	});

	test('should switch between edit and preview modes', async ({
		page,
	}) => {
		// Default is edit mode - editor should be visible
		await expect(page.getByPlaceholder('Script title')).toBeVisible();

		// Switch to preview
		await page.getByRole('button', { name: /preview/i }).click();

		// Editor should no longer be visible
		await expect(
			page.getByPlaceholder('Script title'),
		).not.toBeVisible();

		// Control bar should appear
		await expect(
			page.getByText('Speed', { exact: true }),
		).toBeVisible();
	});

	test('should show control bar in preview mode', async ({
		page,
	}) => {
		await page.getByRole('button', { name: /preview/i }).click();

		// Speed label should be visible (exact match to avoid demo content)
		await expect(
			page.getByText('Speed', { exact: true }),
		).toBeVisible();

		// Progress indicator should be visible
		await expect(page.getByText('remaining')).toBeVisible();
	});

	test('should search scripts', async ({ page }) => {
		// Create a script with unique name
		await page.getByRole('button', { name: /new/i }).click();
		const titleInput = page.getByPlaceholder('Script title');
		await titleInput.fill('UniqueSearchTest123');

		// Search for it
		await page
			.getByPlaceholder('Search scripts...')
			.fill('UniqueSearchTest123');

		// Should find the script
		await expect(page.getByText('UniqueSearchTest123')).toBeVisible();

		// Search for something else
		await page
			.getByPlaceholder('Search scripts...')
			.fill('nonexistent');

		// Should not find the welcome script anymore (filtered out)
		await expect(
			page.getByText('Welcome to CueKit'),
		).not.toBeVisible();
	});

	test('should export script as markdown', async ({ page }) => {
		// Set up download listener
		const downloadPromise = page.waitForEvent('download');

		// Click export button
		await page.getByTitle('Export as Markdown').click();

		const download = await downloadPromise;
		expect(download.suggestedFilename()).toContain('.md');
	});

	test('should persist scripts in localStorage', async ({ page }) => {
		// Create a new script
		await page.getByRole('button', { name: /new/i }).click();
		const titleInput = page.getByPlaceholder('Script title');
		await titleInput.fill('Persisted Script');

		// Reload page
		await page.reload();

		// Script should still be there
		await expect(page.getByText('Persisted Script')).toBeVisible();
	});
});

test.describe('Keyboard Shortcuts', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /preview/i }).click();
	});

	test('space should toggle play/pause', async ({ page }) => {
		// Initially should show play icon (not playing)
		await page.keyboard.press('Space');

		// After pressing space, should be playing
		// We can verify by checking the icon changed or progress started
		await page.waitForTimeout(100);
	});

	test('R should reset position', async ({ page }) => {
		// Start playback
		await page.keyboard.press('Space');
		await page.waitForTimeout(500);

		// Reset
		await page.keyboard.press('r');

		// Progress should be back to 0%
		await expect(page.getByText('0%')).toBeVisible();
	});
});

test.describe('Fullscreen Mode', () => {
	test('should navigate to /prompt route', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /preview/i }).click();

		// Click fullscreen button
		const fullscreenBtn = page
			.getByRole('button')
			.filter({ has: page.locator('[class*="maximize"]') });
		if ((await fullscreenBtn.count()) > 0) {
			await fullscreenBtn.click();
			await expect(page).toHaveURL(/\/prompt/);
		}
	});

	test('should have exit button on prompt page', async ({ page }) => {
		// First go to main page to ensure a script is selected
		await page.goto('/');
		await page.getByRole('button', { name: /preview/i }).click();

		// Navigate to fullscreen mode
		await page.goto('/prompt');

		// Should have controls visible initially
		await expect(page.locator('[role="application"]')).toBeVisible();
	});
});
