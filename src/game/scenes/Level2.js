import BaseLevel from '../core/BaseLevel.js';
import { TRACKS } from '../data/assets.js';
import { transitions } from '../data/dialogs.ca.js';
import { updateHints } from '../systems/interactions.js';

////////////////////////////////////////////////////////
// EL CONILL - catch the White Rabbit in the swamp
////////////////////////////////////////////////////////
export default class Level2 extends BaseLevel {
	static config = {
		map: 'level2',
		tilesets: {
			swamp: ['swamp', 'swamp'],
			bg: ['swamp_bg', 'swamp_bg'],
		},
		layers: [
			{ name: 'bg2', tileset: 'bg', scroll: 0.6 },
			{ name: 'bg1', tileset: 'bg', scroll: 0.7 },
			{ name: 'fg_background', tileset: 'bg', scroll: 0.8 },
			{ name: 'ground_bg', tileset: 'swamp', scroll: 0.9 },
			{ name: 'ground_fg', tileset: 'swamp', collide: true },
			{ name: 'rocks', tileset: 'swamp' },
			{ name: 'decorations', tileset: 'swamp' },
			{ name: 'platforms', tileset: 'swamp', collide: true },
		],
		collision: [0, 5000],
		spawn: ['bunny'],
		zoom: 2.4,
		music: TRACKS.swamp,
	};

	constructor() {
		super('Level2');
	}

	init() {
		super.init();
		this.chasing = false;
	}

	onUpdate() {
		const bunny = this.bunny.sprite;
		updateHints(this, this.bunny.group);

		// The chase starts when the player gets close
		if (this.distanceTo(bunny) < 75) this.chasing = true;
		if (this.chasing) {
			bunny.container.y = bunny.y - 20;
			this.bunny.update();
		}
	}

	onBunny(bunny) {
		bunny.catch(() => {
			this.time.delayedCall(2100, () => {
				this.goTo({ levelName: '', timeout: 4500, textSize: 38, levelKey: 'Level3Prev', text: transitions.backHome });
			});
		});
	}
}
