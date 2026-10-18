import BaseLevel from '../core/BaseLevel.js';
import { HOUSE_OUTSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';

////////////////////////////////////////////////////////
// EL MAPA (prev) - outside the house
////////////////////////////////////////////////////////
export default class Level1Prev extends BaseLevel {
	static config = {
		...HOUSE_OUTSIDE,
		bounds: [-60, 60, 120],
		spawn: ['doors', 'cartells'],
		music: TRACKS.houseOutside,
		hints: ['cartells', 'doors'],
		doors: { 'door-outside': { to: { levelKey: 'Level0' } } },
		exits: {
			left: { at: -30, to: { levelKey: 'Level3Prev3' } },
			right: { at: 30, to: { levelKey: 'Level1' } },
		},
	};

	constructor() {
		super('Level1Prev');
	}

	onCreate() {
		// Enter from the side the player came from
		if (this.previousScene === 'Level3Prev3') this.player.x = 60;
		else if (this.previousScene === 'Level1') this.player.x = this.map.widthInPixels - 30;
	}
}
