import BaseLevel from '../core/BaseLevel.js';
import { HOUSE_INSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level2 } from '../data/dialogs.ca.js';
import { playChestSound } from '../systems/audio.js';

////////////////////////////////////////////////////////
// EL CONILL (prev) - back home with the map
////////////////////////////////////////////////////////
export default class Level2Prev extends BaseLevel {
	static config = {
		...HOUSE_INSIDE,
		spawn: ['doors', 'npcs'],
		music: TRACKS.house,
		hints: ['npcs', 'doors'],
		doorsOpen: true,
		doors: { door0_1: { to: { levelKey: 'Level2Prev2' }, remember: true } },
	};

	constructor() {
		super('Level2Prev');
	}

	onCreate() {
		if (!this.levelState.justArrived) return;
		this.saveLevelState({ justArrived: false });
		this.player.x += 330;
		this.dialog.show(level2.miriamCompass, () => {
			this.inventory.add('bruixola');
			playChestSound(this);
		});
	}

	onUpdate() {
		this.npcs.getChildren().forEach((npc) => this.lookAtPlayer(npc, this.distanceTo(npc)));
	}

	onNpcInteract(npc) {
		if (npc.name === 'Bug') this.talkToBug(npc);
	}
}
