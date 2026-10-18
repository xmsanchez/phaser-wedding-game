// Creates the interactive objects defined in the Tiled object layers.
import { itemLabel } from '../data/items.js';
import { HOSTS } from '../data/npcs.js';
import { createNpcAnimations, createRandomLoop } from './animations.js';

// Reads a Tiled custom property
const prop = (object, name) => object.properties?.find((p) => p.name === name)?.value;

const objectsIn = (scene, layerName) => scene.map.getObjectLayer(layerName)?.objects ?? [];

// Red "B" bubble shown above an object the player can interact with
export function drawHint(scene, obj) {
	const container = scene.add.container(obj.x + obj.width / 2 - 8, obj.y - obj.height - 9);
	container.add(scene.add.circle(0, 0, 9, 0xffffff));
	container.add(scene.add.circle(0, 0, 8, 0xff0000));
	container.add(scene.add.text(-4, -7, 'B', { fontSize: '14px', fill: '#ffffff' }));
	container.setVisible(false);
	return container;
}

// Static, gravity-free sprite used for NPCs, signs and fire
function staticSprite(scene, x, y, texture, frame) {
	const sprite = scene.physics.add.sprite(x, y, texture, frame).setOrigin(0, 1);
	sprite.setImmovable(true);
	sprite.body.setAllowGravity(false);
	return sprite;
}

export function spawnDoors(scene) {
	const group = scene.physics.add.staticGroup();
	objectsIn(scene, 'doors').forEach((door) => {
		const rect = scene.add.rectangle(door.x, door.y + door.height, door.width, door.height).setOrigin(0, 1);
		rect.name = door.name;
		rect.kind = 'door';
		rect.opened = prop(door, 'opened');
		rect.container = drawHint(scene, rect);
		group.add(rect);
	});
	return group;
}

export function spawnNpcs(scene) {
	const group = scene.physics.add.staticGroup();
	objectsIn(scene, 'npcs').forEach((npc) => {
		const sheet = prop(npc, 'spritesheet');
		const sprite = staticSprite(scene, npc.x, npc.y, sheet, prop(npc, 'default_frame'));
		sprite.name = npc.name;
		sprite.contents = prop(npc, 'contains');
		sprite.container = drawHint(scene, sprite);

		createNpcAnimations(scene, npc.name, sheet);
		// Characters with stand/talking animations sit 3px lower on the ground
		if (!HOSTS.includes(npc.name) && npc.name !== 'Stan' && npc.name !== 'Fada') {
			sprite.y += 3;
		}
		group.add(sprite);
	});
	return group;
}

export function spawnTreasures(scene, frame) {
	const group = scene.physics.add.staticGroup();
	objectsIn(scene, 'treasures').forEach((treasure) => {
		// Dynamic body: treasures fall onto the ground/platforms
		const sprite = scene.physics.add.sprite(treasure.x, treasure.y, 'treasure', frame).setOrigin(0, 1).setScale(1.5);
		sprite.name = treasure.name;
		sprite.contents = prop(treasure, 'contains');
		sprite.label = itemLabel(sprite.contents);
		sprite.order = prop(treasure, 'order');
		sprite.container = drawHint(scene, sprite);
		group.add(sprite);
	});
	return group;
}

export function spawnCartells(scene) {
	const group = scene.physics.add.staticGroup();
	objectsIn(scene, 'cartells').forEach((cartell) => {
		const sprite = staticSprite(scene, cartell.x, cartell.y, 'objects', 28);
		sprite.name = cartell.name;
		sprite.text = prop(cartell, 'text');
		sprite.container = drawHint(scene, sprite);
		group.add(sprite);
	});
	return group;
}

export function spawnFire(scene) {
	const group = scene.physics.add.staticGroup();
	objectsIn(scene, 'fire').forEach((fire, index) => {
		const sprite = staticSprite(scene, fire.x, fire.y, 'fire', 0).setScale(5);
		group.add(sprite);
		// Each fire gets its own random flicker
		const key = `fire${index + 1}`;
		createRandomLoop(scene, key, 'fire', 5);
		sprite.anims.play(key, true);
	});
	return group;
}
