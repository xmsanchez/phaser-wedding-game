import { DEFAULT_FRAMES, DISNEY_FRAMES, HOSTS } from '../data/npcs.js';

// Animations live in the global animation manager: create each key only once
function create(scene, config) {
	if (!scene.anims.exists(config.key)) scene.anims.create(config);
}

// An endless loop of random frames from a spritesheet (Stan, the campfires)
export function createRandomLoop(scene, key, sheet, count) {
	if (scene.anims.exists(key)) return;
	const totalFrames = scene.anims.generateFrameNumbers(sheet).length;
	const frames = Array.from({ length: count }, () => ({ key: sheet, frame: Phaser.Math.Between(0, totalFrames - 1) }));
	create(scene, { key, frames, frameRate: 10, repeat: -1 });
}

export function createNpcAnimations(scene, name, sheet) {
	if (HOSTS.includes(name)) return;
	if (name === 'Stan') {
		createRandomLoop(scene, 'Stan_stand', sheet, 10);
		return;
	}
	if (name === 'Fada') {
		create(scene, { key: 'Fada_talking', frames: scene.anims.generateFrameNumbers(sheet, { start: 59, end: 67 }), frameRate: 4, repeat: -1 });
		create(scene, { key: 'Fada_stand', frames: scene.anims.generateFrameNumbers(sheet, { start: 35, end: 40 }), frameRate: 4, repeat: -1 });
		return;
	}
	const [stand, talking] = DISNEY_FRAMES[name] ?? DEFAULT_FRAMES;
	create(scene, { key: `${name}_stand`, frames: scene.anims.generateFrameNumbers(sheet, stand), frameRate: 1, repeat: -1 });
	create(scene, { key: `${name}_talking`, frames: scene.anims.generateFrameNumbers(sheet, talking), frameRate: 4, repeat: -1 });
}

export function createBunnyAnimations(scene) {
	const running = scene.anims.generateFrameNumbers('npc_bunny', { start: 13, end: 18 });
	create(scene, { key: 'bunny-left', frames: running, frameRate: 10, repeat: -1 });
	create(scene, { key: 'bunny-right', frames: running, frameRate: 10, repeat: -1 });
	create(scene, { key: 'bunny-idle', frames: scene.anims.generateFrameNumbers('npc_bunny', { start: 0, end: 0 }), frameRate: 10, repeat: -1 });
}

// Player animations are local to the sprite (frames in the player spritesheet)
export function createPlayerAnimations(sprite) {
	const frames = (config) => sprite.anims.generateFrameNumbers('player', config);
	const add = (key, config) => sprite.anims.create({ key, frames: frames(config), frameRate: 10, repeat: -1 });

	add('idle', { start: 3, end: 3 });
	add('idleRight', { frames: [7] });
	add('idleLeft', { frames: [10] });
	add('left', { start: 8, end: 10 });
	add('right', { start: 5, end: 7 });
	add('jump', { start: 3, end: 3 });
	add('jumpLeft', { start: 10, end: 10 });
	add('jumpRight', { start: 7, end: 7 });
}
