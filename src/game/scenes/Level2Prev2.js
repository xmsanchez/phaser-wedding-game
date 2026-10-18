import BaseLevel from '../core/BaseLevel.js';
import Bunny from '../entities/Bunny.js';
import { HOUSE_OUTSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level2, transitions } from '../data/dialogs.ca.js';

////////////////////////////////////////////////////////
// EL CONILL (prev2) - the White Rabbit runs away
////////////////////////////////////////////////////////
export default class Level2Prev2 extends BaseLevel {
	static config = {
		...HOUSE_OUTSIDE,
		bounds: [-60, 60, 120],
		spawn: ['cartells', 'doors'],
		music: TRACKS.houseOutside,
		hints: ['cartells'],
		exits: {
			left: { at: -30, to: { levelKey: 'Level3Prev3' } },
			right: { at: 30, to: { levelName: '', levelKey: 'Level2', timeout: 5500, textSize: 38, text: transitions.toSwamp } },
		},
	};

	constructor() {
		super('Level2Prev2');
	}

	init() {
		super.init();
		this.bunnyMet = false;
	}

	// The bunny only shows up the first time
	onSpawned() {
		if (!this.visitedBefore) this.bunny = Bunny.spawn(this);
	}

	onUpdate() {
		if (!this.bunny) return;
		const bunny = this.bunny.sprite;
		bunny.flipX = true;
		if (this.distanceTo(bunny) >= 125) return;

		// Look at the bunny
		this.player.setFrame(this.player.x > bunny.x + bunny.width / 2 ? 10 : 7);

		if (!this.bunnyMet) {
			this.bunnyMet = true;
			this.time.delayedCall(400, () => {
				this.dialog.show(level2.bunnyLate(bunny.name), () => this.time.delayedCall(800, () => this.bunnyRunsAway()));
				this.time.delayedCall(400, () => bunny.setVelocityY(-350));
			});
		}
	}

	bunnyRunsAway() {
		const bunny = this.bunny.sprite;
		bunny.flipX = true;
		bunny.anims.play('bunny-left', true);
		bunny.setVelocityX(200);
	}
}
