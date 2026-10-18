import BaseLevel from '../core/BaseLevel.js';
import { HOUSE_OUTSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';

////////////////////////////////////////////////////////
// EL VESTIT (prev2) - outside the house, heading to the castle
////////////////////////////////////////////////////////
export default class Level3Prev2 extends BaseLevel {
	static config = {
		...HOUSE_OUTSIDE,
		bounds: [-60, 0, 60],
		spawn: ['doors', 'cartells'],
		music: TRACKS.houseOutside,
		hints: ['cartells', 'doors'],
		doors: { 'door-outside': { to: { levelKey: 'Level3Prev' } } },
		exits: { left: { at: -30, to: { levelKey: 'Level3Prev3' } } },
	};

	constructor() {
		super('Level3Prev2');
	}

	onCreate() {
		if (this.previousScene === 'Level3Prev3') this.player.x = 60;
	}
}
