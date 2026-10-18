// Smoke test: boots every game level in headless Chrome and fails on page errors.
// Usage: npm run smoke  (env: CHROME_PATH, SMOKE_OUT, SMOKE_LEVELS=Level0,Level4)
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const OUT = process.env.SMOKE_OUT || '.smoke-output';
const LEVELS = (process.env.SMOKE_LEVELS ||
	'Level0,Level1Prev,Level1,Level2Prev,Level2Prev2,Level2,Level3Prev,Level3Prev2,Level3Prev3,Level3,Level4,Level5').split(',');
const PARAMS = Buffer.from(JSON.stringify({ playerName: 'Test', sex: 'man' })).toString('base64');

mkdirSync(OUT, { recursive: true });

const server = await createServer({ server: { port: 5199, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, '');

const browser = await chromium.launch({
	executablePath: CHROME_PATH,
	args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

const results = [];

// Only errors from our own origin count; third-party iframes/scripts (Google) are ignored
const isOwn = (url) => !url || url.startsWith(base);

function trackErrors(page) {
	const errors = [];
	page.on('pageerror', (err) => {
		const where = (err.stack || '').split('\n').slice(1, 3).map((l) => l.trim().replace(base, '')).join(' < ');
		errors.push(`pageerror: ${err.message}  [${where}]`);
	});
	page.on('console', (msg) => {
		if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource') && isOwn(msg.location()?.url) && !/googleapis|Google Maps|AudioContext encountered an error/.test(msg.text())) {
			errors.push(`console.error: ${msg.text().split('\n')[0]}`);
		}
	});
	page.on('response', (res) => {
		if (res.status() >= 400 && isOwn(res.url())) errors.push(`http ${res.status()}: ${res.url()}`);
	});
	page.on('requestfailed', (req) => {
		if (isOwn(req.url())) errors.push(`requestfailed: ${req.url()}`);
	});
	return errors;
}

async function record(name, errors, fn) {
	const start = errors.length;
	let failure = null;
	try {
		await fn();
	} catch (err) {
		failure = err.message.split('\n')[0];
	}
	const newErrors = errors.slice(start);
	if (failure) newErrors.push(`failed: ${failure}`);
	results.push({ name, errors: newErrors });
	console.log(`${newErrors.length ? '✗' : '✓'} ${name}${newErrors.map((e) => `\n    ${e}`).join('')}`);
}

// Waits until the given scene key is running
function waitForScene(page, key, timeout = 30000) {
	return page.waitForFunction((k) => window.__game?.scene?.isActive(k), key, { timeout });
}

async function startLevel(page, levelKey) {
	await page.evaluate((key) => {
		const game = window.__game;
		game.scene.getScenes(true).forEach((s) => {
			if (s.scene.key !== 'MainMenu') s.scene.stop();
		});
		game.scene.getScene('MainMenu').scene.start('PreLevel', { levelKey: key });
	}, levelKey);
	await waitForScene(page, levelKey);
	await page.waitForTimeout(1500);
}

// 1. Game with params: boot and every level
{
	const page = await browser.newPage({ viewport: { width: 500, height: 750 } });
	const errors = trackErrors(page);
	await record('boot with params', errors, async () => {
		await page.goto(`${base}/?parameters=${PARAMS}`, { waitUntil: 'domcontentloaded' });
		await waitForScene(page, 'MainMenu', 60000);
		await page.waitForFunction(() => window.__game.scene.getScene('MainMenu').load.isReady(), null, { timeout: 120000 });
		await page.screenshot({ path: path.join(OUT, 'MainMenu.png') });
	});
	for (const level of LEVELS) {
		await record(`level ${level}`, errors, async () => {
			await startLevel(page, level);
			await page.screenshot({ path: path.join(OUT, `${level}.png`) });
		});
	}
	if (!process.env.SMOKE_LEVELS) await runScenarios(page, errors);
	await page.close();
}

// Gameplay scenarios, driven through the dev-only window.__game handle
async function runScenarios(page, errors) {
	// Reads game state: inventory, open dialog, HUD item count, active level
	const state = () => page.evaluate(() => {
		const game = window.__game;
		const ui = game.scene.getScene('UIScene');
		return {
			inventory: game.registry.get('inventory'),
			dialogOpen: ui.dialog.isOpen,
			hudItems: ui.hud.items.length,
			active: game.scene.getScenes(true).map((s) => s.scene.key),
		};
	});
	// Moves the player onto an object of the given group, found by name or Tiled 'order'
	const moveTo = (level, group, match) => page.evaluate(([level, group, match]) => {
		const scene = window.__game.scene.getScene(level);
		const target = scene[group].getChildren().find((o) => o.name === match || o.order === match);
		scene.player.body.reset(target.x + target.width / 2, target.y - 10);
	}, [level, group, match]);
	const press = async (key = 'Enter', times = 1) => {
		for (let i = 0; i < times; i++) {
			await page.keyboard.press(key);
			await page.waitForTimeout(150);
		}
	};
	const expect = (condition, message) => {
		if (!condition) throw new Error(message);
	};
	const setRegistry = (values) => page.evaluate((values) => {
		Object.entries(values).forEach(([key, value]) => window.__game.registry.set(key, value));
	}, values);

	await record('scenario: Level0 key and door', errors, async () => {
		await setRegistry({ inventory: [], Level0: { doorsOpened: [], treasuresOpened: [] } });
		await startLevel(page, 'Level0');
		// Walking up to Miriam triggers the 2-line welcome, advanced with ENTER
		await moveTo('Level0', 'npcs', 'Miriam');
		await page.waitForTimeout(300);
		expect((await state()).dialogOpen, 'welcome dialog did not open');
		await press('Enter', 2);
		expect(!(await state()).dialogOpen, 'welcome dialog did not close with ENTER');
		// Talking to Miriam: 3 lines, the key is granted when the dialog is dismissed
		await press('Enter');
		await press('Enter', 2);
		expect((await state()).inventory.length === 0, 'key granted before the dialog ended');
		await press('Enter');
		let s = await state();
		expect(JSON.stringify(s.inventory) === '["key"]', `inventory is ${JSON.stringify(s.inventory)}`);
		expect(s.hudItems === 1, `HUD shows ${s.hudItems} items`);
		// The door consumes the key and leads outside
		await moveTo('Level0', 'doors', 'door0_1');
		await press('Enter');
		await waitForScene(page, 'Level1Prev');
		s = await state();
		expect(s.inventory.length === 0, `key not consumed: ${JSON.stringify(s.inventory)}`);
		expect(s.hudItems === 0, `HUD still shows ${s.hudItems} items`);
	});

	await record('scenario: Level1 Stan takes the key, not the stick', errors, async () => {
		await setRegistry({ inventory: ['key', 'pal'], Level1: { doorsOpened: [], treasuresOpened: [], stanMet: true } });
		await startLevel(page, 'Level1');
		await moveTo('Level1', 'npcs', 'Stan');
		await press('Enter');
		await press('Enter', 4);
		const s = await state();
		expect(JSON.stringify(s.inventory) === '["pal","map"]', `inventory is ${JSON.stringify(s.inventory)}`);
	});

	await record('scenario: Level4 box puzzle', errors, async () => {
		await setRegistry({ inventory: [], Level4: { doorsOpened: [], treasuresOpened: [] } });
		await startLevel(page, 'Level4');
		// A wrong second box resets the puzzle
		await moveTo('Level4', 'treasures', 6);
		await press('Enter');
		await moveTo('Level4', 'treasures', 8);
		await press('Enter');
		expect((await state()).dialogOpen, 'no error message for the wrong order');
		const anyOpen = await page.evaluate(() => window.__game.scene.getScene('Level4').treasures.getChildren().some((t) => t.opened));
		expect(!anyOpen, 'boxes were not reset');
		await press('Enter');
		// The right order: melody (2 lines) and then the fairy (3 lines) grants the dress
		for (const box of [6, 4, 8, 2, 9, 1, 3, 7, 5]) {
			await moveTo('Level4', 'treasures', box);
			await press('Enter');
		}
		expect((await state()).dialogOpen, 'no dialog after solving the puzzle');
		await press('Enter', 5);
		const s = await state();
		expect(JSON.stringify(s.inventory) === '["vestit"]', `inventory is ${JSON.stringify(s.inventory)}`);
		await page.screenshot({ path: path.join(OUT, 'scenario-level4.png') });
	});
}

// 2. Game without params must still boot
{
	const page = await browser.newPage({ viewport: { width: 500, height: 750 } });
	const errors = trackErrors(page);
	await record('boot without params', errors, async () => {
		await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
		await waitForScene(page, 'MainMenu', 60000);
		await page.waitForTimeout(1000);
	});
	await page.close();
}

// 3. Landing pages render
for (const route of [`/landing?parameters=${PARAMS}`, '/killingGame']) {
	const page = await browser.newPage();
	const errors = trackErrors(page);
	await record(`page ${route.split('?')[0]}`, errors, async () => {
		await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
		await page.waitForSelector('h1, h2', { timeout: 15000 });
		// Sections fade in when scrolled into view
		await page.evaluate(async () => {
			for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
				window.scrollTo(0, y);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		});
		await page.waitForTimeout(1500);
		await page.screenshot({ path: path.join(OUT, `page${route.split('?')[0].replace('/', '_')}.png`), fullPage: true });
	});
	await page.close();
}

await browser.close();
await server.close();

const failed = results.filter((r) => r.errors.length);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
