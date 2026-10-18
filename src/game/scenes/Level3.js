import BaseLevel from '../core/BaseLevel.js';
import { jungleBackground } from './layers.js';
import { TRACKS } from '../data/assets.js';
import { level3, transitions } from '../data/dialogs.ca.js';
import { FLYING_NPCS, HOSTS } from '../data/npcs.js';
import { playRepeated } from '../systems/audio.js';

////////////////////////////////////////////////////////
// EL BOSC - the Disney characters give hints for the castle puzzle
////////////////////////////////////////////////////////
export default class Level3 extends BaseLevel {
	static config = {
		map: 'level3',
		tilesets: {
			field: ['tileset_field', 'tileset_evening'],
			jungle: ['tileset_jungle', 'tileset_jungle_evening'],
			castle: ['castle_outside', 'castle_outside'],
		},
		layers: [
			...jungleBackground('jungle', 'field'),
			{ name: 'top_bg2', tileset: 'field', scroll: 0.8 },
			{ name: 'top_bg1', tileset: 'field' },
			{ name: 'bg_1', tileset: 'jungle' },
			{ name: 'fg_background', tileset: 'jungle' },
			{ name: 'ground_bg', tileset: 'field' },
			{ name: 'castle_outside', tileset: 'castle' },
			{ name: 'ground_decorations', tileset: 'field' },
			{ name: 'ground_fg', tileset: 'jungle', collide: true },
			'@fire',
			{ name: 'rocks', tileset: 'field', collide: true },
			{ name: 'rocks2', tileset: 'jungle', collide: true },
			{ name: 'platforms', tileset: 'field', collide: true },
		],
		collision: [0, 20000],
		spawn: ['npcs', 'doors'],
		playerBodyWidth: 13,
		zoom: 2.5,
		music: TRACKS.jungle,
		hints: ['npcs', 'doors'],
		doors: { door_castle: { to: { levelKey: 'Level4' } } },
	};

	constructor() {
		super('Level3');
	}

	init() {
		super.init();
		this.inUnderworldLeft = false;
		this.inUnderworldRight = false;
		this.finishShown = false;
	}

	onCreate() {
		this.hasDress = this.inventory.has('vestit');

		this.npcs.getChildren().forEach((npc) => {
			const isHost = HOSTS.includes(npc.name);
			// Xavi and Miriam only appear once the player has the dress
			if (isHost && !this.hasDress) npc.x = -200;
			if (FLYING_NPCS[npc.name]) this.float(npc, FLYING_NPCS[npc.name]);
			if (!isHost) npc.anims.play(npc.name + '_stand', true);
		});

		// Coming out of the castle
		if (this.previousScene === 'Level4') {
			const door = this.doors.getChildren()[0];
			this.player.x = door.x;
			this.player.y = door.y - 20;
		}

		if (this.hasDress) {
			this.cameras.main.y = this.player.y - 250;
			this.hints = [];
		}
	}

	onUpdate() {
		// The player has completed the game!!
		if (this.hasDress) {
			this.showEnding();
			return;
		}

		this.npcs.getChildren().forEach((npc) => {
			const isHost = HOSTS.includes(npc.name);
			if (!this.dialog.isOpen && !isHost) npc.anims.play(npc.name + '_stand', true);
			// NPCs look at the player (the Disney sprites face the other way by default)
			if (npc.name !== 'Rapunzel') {
				this.lookAtPlayer(npc, this.distanceTo(npc), !isHost && npc.name !== 'Simba');
			}
		});

		this.checkUnderworld();
	}

	// Falling below the forest floor respawns the player on the side they fell from
	checkUnderworld() {
		const { player, map } = this;
		if (player.y >= map.heightInPixels - 300) {
			if (player.x > map.widthInPixels - 350) {
				this.inUnderworldRight = true;
				this.inUnderworldLeft = false;
			} else if (player.x < 625) {
				this.inUnderworldRight = false;
				this.inUnderworldLeft = true;
			}
		}

		if (player.y > map.heightInPixels) {
			if (this.inUnderworldRight) {
				player.x = map.widthInPixels - 250;
				player.y = map.heightInPixels - 140;
			}
			if (this.inUnderworldLeft) {
				player.x = 625;
				player.y = map.heightInPixels - 140;
			}
		}
	}

	showEnding() {
		if (this.finishShown || this.dialog.isOpen) return;
		this.finishShown = true;
		this.dialog.show(level3.finish, () => {
			this.goTo(
				{ textSize: 40, timeout: 5000, levelName: transitions.epilogueTitle, levelKey: 'Level5', text: transitions.epilogue },
				{ fadeOut: 4000, delay: 5000 }
			);
		});
	}


	onNpcInteract(npc) {
		if (npc.name === 'Xavi') {
			this.dialog.show(level3.xaviHello(npc.name));
			return;
		}
		if (npc.name === 'Miriam') {
			this.dialog.show(level3.miriamHello(npc.name));
			return;
		}

		const dialog = level3.npcs[npc.name];
		if (!dialog) return;
		npc.anims.play(npc.name + '_talking', true);
		// Pluto's owner, Bug, barks from far away
		const onComplete = npc.name === 'Pluto' ? () => playRepeated(this, 'audio_dog_bark', 3, { volume: 0.5 }) : undefined;
		this.dialog.show(dialog(npc.name), onComplete);
	}
}
