import BaseLevel from '../core/BaseLevel.js';
import { HOUSE_INSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level3 } from '../data/dialogs.ca.js';

////////////////////////////////////////////////////////
// EL VESTIT (prev) - home again: now you need a dress
////////////////////////////////////////////////////////
export default class Level3Prev extends BaseLevel {
	static config = {
		...HOUSE_INSIDE,
		spawn: ['doors', 'npcs'],
		music: TRACKS.house,
		hints: ['npcs', 'doors'],
		doorsOpen: true,
		doors: { door0_1: { to: { levelKey: 'Level3Prev2' }, remember: true } },
	};

	constructor() {
		super('Level3Prev');
	}

	onCreate() {
		// Xavi waits right next to the door
		const xavi = this.npcs.getChildren().find((npc) => npc.name === 'Xavi');
		xavi.x = this.player.x + 80;
		xavi.container.x = xavi.x;
	}

	onUpdate() {
		this.npcs.getChildren().forEach((npc) => {
			const distance = this.distanceTo(npc);
			this.lookAtPlayer(npc, distance);

			if (distance < 300 && !this.levelState.introDone && !this.dialog.isOpen) {
				this.saveLevelState({ introDone: true });
				// Coming back from outside: the hosts already explained everything
				if (this.previousScene !== 'Level3Prev2') this.dialog.show(level3.homeIntro(npc.name));
			}
		});
	}

	onNpcInteract(npc) {
		if (npc.name === 'Bug') this.talkToBug(npc);
		else if (npc.name === 'Xavi') this.dialog.show(level3.xaviGoGetDress(npc.name));
		else if (npc.name === 'Miriam') this.dialog.show(level3.miriamClock(npc.name));
	}
}
