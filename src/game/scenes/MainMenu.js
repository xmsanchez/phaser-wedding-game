import { IMAGES, PLAYER_SHEETS, SFX, SPRITESHEETS, TILEMAPS } from '../data/assets.js';
import { mainMenu, transitions } from '../data/dialogs.ca.js';

// Levels whose progress (doors/treasures opened, flags) is kept in the registry
const LEVEL_KEYS = ['Level0', 'Level1Prev', 'Level1', 'Level2Prev', 'Level2Prev2', 'Level2',
	'Level3Prev', 'Level3Prev2', 'Level3Prev3', 'Level3', 'Level4', 'Level5'];

export default class MainMenu extends Phaser.Scene {
	constructor() {
		super('MainMenu');
	}

	preload() {
		this.showProgressBar();

		const sex = this.registry.get('invite')?.sex ?? 'man';
		Object.entries(IMAGES).forEach(([key, path]) => this.load.image(key, path));
		Object.entries({ ...SPRITESHEETS, player: PLAYER_SHEETS[sex] }).forEach(([key, { path, frameWidth, frameHeight }]) => {
			this.load.spritesheet(key, path, { frameWidth, frameHeight });
		});
		Object.entries(TILEMAPS).forEach(([key, path]) => this.load.tilemapTiledJSON(key, path));
		Object.entries(SFX).forEach(([key, path]) => this.load.audio(key, path));
	}

	create() {
		this.resetProgress();

		const { width, height } = this.cameras.main;
		const centerX = width / 2;
		const centerY = height / 2;

		this.add.sprite(centerX, centerY - 290, 'logo');

		const startText = this.add.text(centerX, centerY, mainMenu.start, { font: 'italic 30px Arial' }).setOrigin(0.5);
		this.tweens.add({ targets: startText, alpha: 0.3, duration: 500, ease: 'Exponential', yoyo: true, repeat: -1 });

		this.add.text(centerX, centerY + 130, mainMenu.instructions, {
			font: '25px Arial',
			wordWrap: { width: 500, useAdvancedWrap: true },
		}).setOrigin(0.5);

		const start = () => this.scene.start('PreLevel', { levelName: '', timeout: 200, levelKey: 'Level0', text: transitions.arrival });
		this.input.once('pointerdown', start);
		this.input.keyboard.once('keydown-ENTER', start);
	}

	resetProgress() {
		this.registry.set('inventory', []);
		this.registry.set('scenesVisited', []);
		this.registry.set('previousScene', 'MainMenu');
		LEVEL_KEYS.forEach((key) => this.registry.set(key, { doorsOpened: [], treasuresOpened: [] }));
		this.registry.set('Level2Prev', { doorsOpened: [], treasuresOpened: [], justArrived: true });
	}

	showProgressBar() {
		const { width, height } = this.cameras.main;
		const barWidth = 300;
		const x = (width - barWidth) / 2;
		const y = height / 2;

		const box = this.add.graphics();
		box.fillStyle(0x222222, 0.8);
		box.fillRect(x - 10, y - 50, barWidth + 20, 50);
		const bar = this.add.graphics();
		const assetText = this.add.text(width / 2, y + 50, '', { font: '18px monospace' }).setOrigin(0.5);

		this.load.on('progress', (value) => {
			bar.clear();
			bar.fillStyle(0xffffff, 1);
			bar.fillRect(x, y - 40, barWidth * value, 30);
		});
		this.load.on('fileprogress', (file) => assetText.setText('Loading asset: ' + file.key));
		this.load.once('complete', () => {
			bar.destroy();
			box.destroy();
			assetText.destroy();
		});
	}
}
