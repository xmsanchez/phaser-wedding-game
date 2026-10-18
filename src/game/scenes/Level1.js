import BaseLevel from '../core/BaseLevel.js';
import { jungleBackground } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level1, transitions } from '../data/dialogs.ca.js';
import { playChestSound } from '../systems/audio.js';

////////////////////////////////////////////////////////
// EL MAPA - the forest, where Stan trades the map for a key
////////////////////////////////////////////////////////
export default class Level1 extends BaseLevel {
	static config = {
		map: 'level1',
		tilesets: {
			field: ['tileset_field', 'tileset_field'],
			jungle: ['tileset_jungle', 'tileset_jungle'],
		},
		layers: [
			...jungleBackground('jungle', 'field'),
			{ name: 'top_bg2', tileset: 'field' },
			{ name: 'top_bg1', tileset: 'field' },
			{ name: 'bg_1', tileset: 'jungle' },
			{ name: 'fg_background', tileset: 'jungle' },
			{ name: 'ground_bg', tileset: 'jungle' },
			{ name: 'ground_decorations', tileset: 'field' },
			{ name: 'ground_fg', tileset: 'jungle', collide: true },
			{ name: 'platforms', tileset: 'field', collide: true },
		],
		collision: [0, 20000],
		bounds: [-30, 0, 30],
		spawn: ['npcs', 'treasures', 'cartells'],
		playerBodyWidth: 13,
		zoom: 3,
		music: TRACKS.jungle,
		hints: ['npcs', 'treasures', 'cartells'],
		exits: {
			// Back home once Stan has handed over the map
			left: {
				at: 0,
				to: (scene) => (scene.levelState.hasMap
					? { levelName: '', timeout: 2000, levelKey: 'Level2Prev', text: transitions.toBunnyHouse }
					: { levelKey: 'Level1Prev' }),
			},
		},
	};

	constructor() {
		super('Level1');
	}

	onUpdate() {
		this.npcs.getChildren().forEach((stan) => {
			this.lookAtPlayer(stan);
			if (!this.dialog.isOpen) {
				stan.anims.stop();
				stan.setFrame(2);
			}

			if (!this.levelState.stanMet && this.distanceTo(stan) < 55 && !this.dialog.isOpen) {
				stan.anims.play('Stan_stand', true);
				this.dialog.show(level1.stanIntro, () => this.saveLevelState({ stanMet: true }));
			}
		});
	}

	onNpcInteract(stan) {
		stan.anims.play('Stan_stand', true);
		if (!this.levelState.stanMet) return;

		if (this.levelState.hasMap) {
			this.dialog.show(level1.stanHasMap);
		} else if (this.inventory.has('key')) {
			this.dialog.show(level1.stanTrade, () => {
				this.inventory.remove('key');
				this.inventory.add(stan.contents);
				playChestSound(this);
				this.saveLevelState({ hasMap: true });
			});
		} else {
			this.dialog.show(level1.stanNoKey);
		}
	}
}
