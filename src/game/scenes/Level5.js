import BaseLevel from '../core/BaseLevel.js';
import { TRACKS } from '../data/assets.js';
import { credits } from '../data/dialogs.ca.js';
import { FLYING_NPCS, HOSTS } from '../data/npcs.js';
import { inviteQuery } from '../../utils/params.js';

const LANTERNS = 400;
// Timeline of the ending (ms)
const CAMERA_PAN_AT = 1000;
const CAMERA_RISE_AT = 5000;
const CAMERA_SKY_AT = 27000;
const FADE_OUT_AT = 216000;

////////////////////////////////////////////////////////
// EPÍLEG - lanterns rise over the castle while the credits roll
////////////////////////////////////////////////////////
export default class Level5 extends BaseLevel {
	static config = {
		map: 'level5',
		tilesets: {
			night: ['tileset_night', 'tileset_night'],
			sky: ['sky_night', 'sky_night'],
			castle: ['castle_outside', 'castle_outside'],
		},
		layers: [
			{ name: 'top_bg4', tileset: 'sky', scroll: 0.4 },
			{ name: 'top_bg3', tileset: 'sky', scroll: 0.5 },
			{ name: 'top_bg2', tileset: 'sky', scroll: 0.6 },
			{ name: 'top_bg1', tileset: 'sky', scroll: 0.4 },
			{ name: 'ground_bg', tileset: 'night' },
			{ name: 'castle_outside', tileset: 'castle' },
			{ name: 'ground_fg', tileset: 'night', collide: true },
		],
		collision: [0, 20000],
		spawn: ['npcs'],
		playerBodyWidth: 13,
		music: TRACKS.night,
		controls: false,
		fadeIn: 4000,
	};

	constructor() {
		super('Level5');
	}

	init() {
		super.init();
		this.texts = [];
	}

	onCreate() {
		// A cinematic: no inventory, no controls and no visible player
		this.ui.hud.setVisible(false);
		this.ui.setControlsVisible(false);
		this.player.setVisible(false);

		this.npcs.getChildren().forEach((npc) => {
			if (FLYING_NPCS[npc.name]) this.float(npc, FLYING_NPCS[npc.name]);
			if (HOSTS.includes(npc.name)) npc.flipX = true;
			else npc.anims.play(npc.name + '_stand', true);
		});

		this.lights.enable();
		this.lights.setAmbientColor(0xffffff);

		this.animateCamera();
		this.spawnLanterns();
		credits.forEach((entry) => this.showCredit(...entry));
	}

	// The camera starts at the bottom right, pans left and rises to the sky
	animateCamera() {
		const camera = this.cameras.main;
		camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		camera.scrollX = this.map.widthInPixels - camera.width;
		camera.setZoom(1.5);
		camera.scrollY = this.map.heightInPixels;

		this.time.delayedCall(CAMERA_PAN_AT, () => {
			this.tweens.add({ targets: camera, scrollX: 200, duration: 17000, ease: 'Sine.easeInOut' });
		});
		this.time.delayedCall(CAMERA_RISE_AT, () => {
			this.tweens.add({ targets: camera, zoom: 1, scrollY: 300, duration: 13000, ease: 'Sine.easeInOut' });
		});
		this.time.delayedCall(CAMERA_SKY_AT, () => {
			this.tweens.add({ targets: camera, zoom: 1.8, scrollY: -600, duration: 24000, ease: 'Sine.easeInOut' });
		});

		// Fade to black and open the invitation page
		this.time.delayedCall(FADE_OUT_AT, () => {
			camera.fadeOut(4000);
			this.time.delayedCall(5000, () => {
				window.location = '/landing' + inviteQuery(this.registry.get('invite')?.raw);
			});
		});
	}

	// Credits keep a fixed size on screen regardless of the camera zoom
	update() {
		this.texts.forEach((text) => text.setScale(1 / this.cameras.main.zoom));
	}

	showCredit(content, startTime, fadeTime, holdTime, fontSize = '32px', style = 'center') {
		const { width, height } = this.cameras.main;
		const y = style === 'resum' ? height / 2 - 120 : height / 2;
		const text = this.add.text(width / 2, y, content, {
			fontSize,
			fill: '#FFFFFF',
			align: style === 'resum' ? 'left' : style,
		});

		if (style === 'center') {
			text.setOrigin(0.5, 0.5);
		} else if (style === 'left') {
			text.setOrigin(0.5, 0.1);
			text.y = 320;
		} else if (style === 'resum') {
			text.setOrigin(0.5, 0.1);
		}
		text.setAlpha(0).setVisible(false).setScrollFactor(0, 0);

		this.time.delayedCall(startTime, () => {
			text.setVisible(true);
			this.tweens.add({
				targets: text,
				alpha: 1,
				duration: fadeTime,
				ease: 'Sine.easeInOut',
				onComplete: () => {
					this.time.delayedCall(holdTime, () => {
						this.tweens.add({ targets: text, alpha: 0, duration: fadeTime, ease: 'Sine.easeInOut' });
					});
				},
			});
		});
		this.texts.push(text);
	}

	spawnLanterns() {
		const lanterns = this.physics.add.group();
		for (let i = 0; i < LANTERNS; i++) {
			const lantern = lanterns.create(Phaser.Math.Between(200, 650), this.player.y + 5, 'lantern');
			lantern.body.allowGravity = false;
			lantern.setScale(0.5);
			lantern.setPipeline('Light2D').setAlpha(0.05);

			// Each lantern starts rising at a random moment
			const delay = Phaser.Math.Between(0, 150000);
			this.time.delayedCall(5000, () => {
				this.tweens.add({ targets: lantern, alpha: 1, duration: 500, ease: 'Sine.easeInOut', delay });
				this.tweens.add({ targets: lantern, y: lantern.y - 2000, duration: 105000, ease: 'Sine.easeInOut', delay });
				// Swirl left and right
				this.tweens.add({
					targets: lantern,
					x: { start: lantern.x, to: [lantern.x, lantern.x + 20] },
					duration: 5000,
					ease: 'Sine.easeInOut',
					repeat: -1,
					yoyo: true,
					delay,
				});
				// Slowly drift to the right, like if there was wind
				this.tweens.add({
					targets: lantern,
					x: lantern.x + Phaser.Math.Between(100, 500),
					duration: 50000,
					ease: 'Sine.easeInOut',
					repeat: -1,
					yoyo: true,
					delay,
				});
			});
		}
	}
}
