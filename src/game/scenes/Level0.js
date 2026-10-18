import BaseLevel from '../core/BaseLevel.js';
import { HOUSE_INSIDE } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level0 } from '../data/dialogs.ca.js';
import { playChestSound } from '../systems/audio.js';

////////////////////////////////////////////////////////
// L'ARRIBADA - Xavi and Miriam's living room
////////////////////////////////////////////////////////
export default class Level0 extends BaseLevel {
	static config = {
		...HOUSE_INSIDE,
		spawn: ['doors', 'npcs'],
		music: TRACKS.house,
		hints: ['npcs', 'doors'],
		doors: { door0_1: { to: { levelKey: 'Level1Prev' }, remember: true } },
	};

	constructor() {
		super('Level0');
	}

	onUpdate() {
		this.npcs.getChildren().forEach((npc) => {
			const distance = this.distanceTo(npc);
			this.lookAtPlayer(npc, distance);

			// The first time the player walks up to the hosts they tell the big news
			if (distance < 75 && !this.levelState.welcomed && !this.dialog.isOpen) {
				this.saveLevelState({ welcomed: true });
				this.dialog.show(level0.welcome(npc.name, this.registry.get('invite').playerName));
			}
		});
	}

	onNpcInteract(npc) {
		// Bug always does his own thing :-)
		if (npc.name === 'Bug') {
			this.talkToBug(npc);
			return;
		}

		const isXavi = npc.name === 'Xavi';
		if (this.doorOpened) {
			this.dialog.show(level0.doorOpened(npc.name));
		} else if (this.inventory.has('key')) {
			this.dialog.show(isXavi ? level0.xaviHasKey(npc.name) : level0.miriamHasKey(npc.name));
		} else if (isXavi) {
			this.dialog.show(level0.xaviNoKey(npc.name));
		} else {
			this.dialog.show(level0.miriamGivesKey(npc.name), () => {
				this.inventory.add(npc.contents);
				playChestSound(this);
			});
		}
	}
}
