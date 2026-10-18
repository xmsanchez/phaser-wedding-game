import BaseLevel from '../core/BaseLevel.js';
import BoxPuzzle from '../core/BoxPuzzle.js';
import { level4 } from '../data/dialogs.ca.js';
import { updateHints } from '../systems/interactions.js';
import { fadeInTrack, playChestSound, playSfx } from '../systems/audio.js';

// Order in which the boxes must be opened (hinted by the characters in the forest)
const SOLUTION = [6, 4, 8, 2, 9, 1, 3, 7, 5];
// Piano note played by each box (1-9): together they play a melody
const BOX_NOTES = [null, 5, 4, 3, 2, 3, 2, 1, 2, 3];

const BOX_FRAME_CLOSED = 14;
const BOX_FRAME_PRESSED = 15;

////////////////////////////////////////////////////////
// EL CASTELL - open the boxes in the right order to get the dress
////////////////////////////////////////////////////////
export default class Level4 extends BaseLevel {
	static config = {
		map: 'level4',
		tilesets: { castle: ['castle_inside', 'castle_inside'] },
		layers: [
			{ name: 'bg_background', tileset: 'castle' },
			{ name: 'fg_background', tileset: 'castle' },
			{ name: 'ground_bg', tileset: 'castle' },
			{ name: 'ground_fg', tileset: 'castle', collide: true },
			{ name: 'ground_decorations', tileset: 'castle' },
			{ name: 'decorations', tileset: 'castle' },
		],
		collision: [0, 1400],
		bounds: [-60, 0, 60],
		spawn: ['npcs', 'treasures'],
		treasureFrame: 12,
		zoom: 1.8,
		extraAudio: ['background_music_tangled'],
		hints: ['npcs'],
		exits: { left: { at: -30, to: { levelKey: 'Level3' } } },
	};

	constructor() {
		super('Level4');
	}

	init() {
		super.init();
		this.puzzle = new BoxPuzzle(SOLUTION);
	}

	onCreate() {
		this.fairy = this.npcs.getChildren().find((npc) => npc.name === 'Fada');
	}

	onUpdate() {
		if (!this.levelState.boxGameFinished) updateHints(this, this.treasures);
	}

	onTreasure(box) {
		if (this.levelState.boxGameFinished || box.opened) return;
		box.opened = true;
		box.setFrame(BOX_FRAME_PRESSED);
		playSfx(this, `audio_piano_s${BOX_NOTES[box.order]}`, { volume: 1 });

		const result = this.puzzle.press(box.order);
		if (result === 'wrong') {
			this.dialog.show([level4.wrongOrder]);
			this.treasures.getChildren().forEach((treasure) => {
				treasure.opened = false;
				treasure.setFrame(BOX_FRAME_CLOSED);
			});
		} else if (result === 'solved') {
			this.solvePuzzle();
		}
	}

	solvePuzzle() {
		this.saveLevelState({ boxGameFinished: true, fairyMet: true });
		fadeInTrack(this, 'background_music_tangled', { volume: 0.1, duration: 30000 });

		this.dialog.show(level4.melody, () => {
			this.fairy.anims.play('Fada_talking', true);
			this.dialog.show(level4.fairyReward, () => {
				this.fairy.anims.play('Fada_stand', true);
				this.inventory.add(this.fairy.contents);
				playChestSound(this);
			});
		});
	}

	onNpcInteract(npc) {
		npc.anims.stop();
		if (!this.levelState.fairyMet) {
			this.saveLevelState({ fairyMet: true });
			this.dialog.show(level4.fairyIntro(npc.name));
		} else if (!this.levelState.boxGameFinished) {
			this.dialog.show(level4.fairyReminder(npc.name));
		} else {
			this.dialog.show(level4.fairyDone(npc.name));
		}
	}
}
