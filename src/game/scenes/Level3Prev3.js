import BaseLevel from '../core/BaseLevel.js';
import { TRACKS } from '../data/assets.js';
import { level3 } from '../data/dialogs.ca.js';

////////////////////////////////////////////////////////
// DIRECCIÓ AL CASTELL - the bridge is closed until you have the map and the clock
////////////////////////////////////////////////////////
export default class Level3Prev3 extends BaseLevel {
	static config = {
		map: 'house-outside-castle-direction',
		// Evening colours when coming from the house on the way to the castle
		tilesets: (scene) => ({
			field: ['tileset_field', scene.previousScene === 'Level3Prev2' ? 'tileset_evening' : 'tileset_field'],
			outside: ['house-outside', 'house-outside'],
		}),
		layers: [
			{ name: 'bg_5', tileset: 'field', scroll: 0.4 },
			{ name: 'bg_4', tileset: 'outside', scroll: 0.5 },
			{ name: 'bg_3', tileset: 'outside', scroll: 0.6 },
			{ name: 'bg_2', tileset: 'outside', scroll: 0.7 },
			{ name: 'top_bg4', tileset: 'field', scroll: 0.4 },
			{ name: 'top_bg3', tileset: 'field', scroll: 0.5 },
			{ name: 'top_bg2', tileset: 'field', scroll: 0.6 },
			{ name: 'top_bg1', tileset: 'field', scroll: 0.7 },
			{ name: 'bg_1', tileset: 'outside', scroll: 0.8 },
			{ name: 'fg_background', tileset: 'field', scroll: 0.9 },
			{ name: 'ground_bg', tileset: 'outside', scroll: 0.8 },
			{ name: 'rocks', tileset: 'field' },
			{ name: 'ground_decorations', tileset: 'field' },
			{ name: 'ground_fg', tileset: 'outside', collide: true },
			{ name: 'platforms', tileset: 'field', collide: true },
		],
		collision: [0, 20000],
		bounds: [-60, 60, 120],
		spawn: ['npcs', 'cartells'],
		zoom: 3,
		music: TRACKS.field,
		hints: ['npcs', 'cartells'],
		exits: {
			left: { at: 0, to: { levelKey: 'Level3' } },
			right: { at: 30, to: (scene) => ({ levelKey: scene.previousScene }) },
		},
	};

	constructor() {
		super('Level3Prev3');
	}

	onCreate() {
		this.blocked = !(this.inventory.has('map') && this.inventory.has('clock'));
		if (this.blocked) {
			// The worker blocks the way to the castle
			const worker = this.npcs.getChildren()[0];
			this.physics.world.setBounds(worker.x + 20, 0, this.map.widthInPixels + 60, this.map.heightInPixels * this.map.tileHeight);
		}
	}

	onUpdate() {
		this.npcs.getChildren().forEach((npc) => {
			this.lookAtPlayer(npc);
			if (this.blocked && this.distanceTo(npc) < 80 && !this.levelState.workerTalked && !this.dialog.isOpen) {
				this.dialog.show(level3.workerBlocked, () => this.saveLevelState({ workerTalked: true }));
			}
		});
	}

	onNpcInteract() {
		this.dialog.show(this.blocked ? level3.workerBlockedAgain : level3.workerFixed);
	}
}
