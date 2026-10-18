import Player from '../entities/Player.js';
import Bunny from '../entities/Bunny.js';
import { spawnCartells, spawnDoors, spawnFire, spawnNpcs, spawnTreasures } from '../systems/spawners.js';
import { overlapping, updateHints } from '../systems/interactions.js';
import { fadeOutMusic, playChestSound, playSfx, queueMusic, startMusic } from '../systems/audio.js';
import { BUG_FRAMES } from '../data/npcs.js';
import { common, mainMenu } from '../data/dialogs.ca.js';

const SPAWNERS = { doors: spawnDoors, npcs: spawnNpcs, cartells: spawnCartells, fire: spawnFire };

// Treasures and the bunny land on these layers
const GROUND_LAYERS = ['ground_fg', 'platforms'];

/*
 * Shared pipeline for every playable level. Subclasses describe the level with a static
 * `config` and only implement what is unique to them through the hooks:
 *   onCreate(), onUpdate(), onNpcInteract(npc), onTreasure(treasure), onBunny(bunny)
 *
 * static config = {
 *   map: 'level1',                                   tilemap key
 *   tilesets: { field: ['tileset_field', 'tileset_field'] }   alias -> [name in Tiled, texture key]
 *             (or a function(scene) returning that object)
 *   layers: [{ name, tileset, scroll?, collide? } | '@fire'], in draw order ('@group' spawns a group at that depth)
 *   collision: [from, to],                           tile index range that collides
 *   bounds: [left, top, extraWidth],                 world bounds relative to the map size
 *   spawn: ['doors', 'npcs', 'treasures', 'cartells', 'bunny'],
 *   treasureFrame, playerBodyWidth, zoom, fadeIn, controls: false,
 *   music: TRACKS.house, extraAudio: ['key'],
 *   hints: ['npcs', 'doors'],                        groups that show the "B" hint
 *   doors: { door0_1: { to: { levelKey }, remember: true } },  where each door leads
 *   doorsOpen: true,                                 all doors start opened
 *   exits: { left: { at: -30, to }, right: { at: 30, to } },  leaving the map; `to` may be a function
 * }
 */
export default class BaseLevel extends Phaser.Scene {
	get config() {
		return this.constructor.config;
	}

	// Transient state: reset every time the level starts (Phaser reuses scene instances)
	init() {
		this.player = null;
		this.bunny = null;
		this.layers = {};
		this.music = [];
		this.transitioning = false;
		this.hints = null; // set to override config.hints at runtime
		this.npcs = this.doors = this.treasures = this.cartells = this.fire = null;
	}

	preload() {
		const keys = [...(this.config.music ?? []).map((track) => track.key), ...(this.config.extraAudio ?? [])];
		queueMusic(this, keys);
		if (this.load.list.size > 0) {
			const { width, height } = this.cameras.main;
			const text = this.add.text(width / 2, height / 2, mainMenu.loading, { font: '32px monospace' }).setOrigin(0.5);
			this.load.once('complete', () => text.destroy());
		}
	}

	create() {
		const config = this.config;
		this.ui = this.scene.get('UIScene');
		this.dialog = this.ui.dialog;
		this.inventory = this.ui.inventory;
		this.controls = this.ui.controls;
		this.ui.scene.setVisible(true);
		this.ui.scene.bringToTop();

		this.previousScene = this.registry.get('previousScene');
		const visited = this.registry.get('scenesVisited');
		this.visitedBefore = visited.includes(this.scene.key);
		visited.push(this.scene.key);

		this.buildMap();
		(config.spawn ?? []).forEach((name) => this.spawnGroup(name));

		this.player = this.spawnPlayer();
		if (config.playerBodyWidth) this.player.setSize(config.playerBodyWidth);
		this.onSpawned?.();
		this.addColliders();

		startMusic(this, config.music ?? []);
		if (config.controls !== false) this.bindControls();
		if (config.zoom) this.setupCamera(config.zoom);
		this.cameras.main.fadeIn(config.fadeIn ?? 250);

		this.restoreProgress();
		this.onCreate?.();
	}

	update() {
		if (!this.player) return;
		this.player.update(this.controls, this.dialog.isOpen);
		(this.hints ?? this.config.hints ?? []).forEach((group) => updateHints(this, this[group]));
		this.checkExits();
		this.onUpdate?.();
	}

	// --- Building the level ---------------------------------------------------------

	buildMap() {
		const config = this.config;
		this.map = this.make.tilemap({ key: config.map });

		const tilesets = typeof config.tilesets === 'function' ? config.tilesets(this) : config.tilesets;
		this.tilesets = Object.fromEntries(
			Object.entries(tilesets).map(([alias, [name, texture]]) => [alias, this.map.addTilesetImage(name, texture)])
		);

		const [from, to] = config.collision;
		this.collidingLayers = [];
		config.layers.forEach((layer) => {
			if (typeof layer === 'string') {
				this.spawnGroup(layer.slice(1));
				return;
			}
			if (this.map.getLayerIndex(layer.name) === null) return;
			const tilemapLayer = this.map.createLayer(layer.name, this.tilesets[layer.tileset]);
			if (layer.scroll !== undefined) tilemapLayer.scrollFactorX = layer.scroll;
			if (layer.collide) {
				tilemapLayer.setCollisionBetween(from, to, true, true);
				this.collidingLayers.push(tilemapLayer);
			}
			this.layers[layer.name] = tilemapLayer;
		});

		const [left, top, extraWidth] = config.bounds ?? [0, 0, 0];
		this.physics.world.setBounds(left, top, this.map.widthInPixels + extraWidth, this.map.heightInPixels * this.map.tileHeight);
	}

	spawnGroup(name) {
		if (name === 'bunny') this.bunny = Bunny.spawn(this);
		else if (name === 'treasures') this.treasures = spawnTreasures(this, this.config.treasureFrame);
		else this[name] = SPAWNERS[name](this);
	}

	spawnPlayer() {
		const start = this.map.getObjectLayer('player').objects.find((obj) => obj.name === 'player');
		return new Player(this, start.x, start.y);
	}

	addColliders() {
		const ground = GROUND_LAYERS.map((name) => this.layers[name]).filter(Boolean);
		this.collidingLayers.forEach((layer) => this.physics.add.collider(this.player, layer));
		if (this.treasures) ground.forEach((layer) => this.physics.add.collider(this.treasures, layer));
		if (this.bunny) ground.forEach((layer) => this.physics.add.collider(this.bunny.sprite, layer));
	}

	setupCamera(zoom) {
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		camera.setZoom(zoom);
	}

	bindControls() {
		const onJump = () => {
			if (!this.dialog.isOpen) this.player.jump();
		};
		const onAction = () => this.handleInteract();
		this.controls.on('jump', onJump);
		this.ui.events.on('action', onAction);
		this.events.once('shutdown', () => {
			this.controls.off('jump', onJump);
			this.ui.events.off('action', onAction);
		});
	}

	// --- Persistent per-level state (registry) ----------------------------------------

	get levelState() {
		return this.registry.get(this.scene.key) ?? {};
	}

	saveLevelState(patch) {
		this.registry.set(this.scene.key, { ...this.levelState, ...patch });
	}

	// Re-applies what the player already did in this level on a previous visit
	restoreProgress() {
		const { doorsOpened = [], treasuresOpened = [] } = this.levelState;
		this.doors?.getChildren().forEach((door) => {
			if (this.config.doorsOpen || doorsOpened.includes(door.name)) {
				door.opened = true;
				this.doorOpened = true;
			}
		});
		this.treasures?.getChildren().forEach((treasure) => {
			if (treasuresOpened.includes(treasure.name)) {
				treasure.opened = true;
				treasure.setFrame(11);
			}
		});
	}

	// --- Leaving the level -------------------------------------------------------------

	// Fades out and starts the PreLevel scene, which then launches data.levelKey
	goTo(data, { fadeOut = 250, delay = 500 } = {}) {
		if (this.transitioning) return;
		this.transitioning = true;
		this.registry.set('previousScene', this.scene.key);
		this.cameras.main.fadeOut(fadeOut);
		fadeOutMusic(this);
		this.time.delayedCall(delay, () => {
			this.scene.stop('UIScene');
			this.scene.start('PreLevel', data);
		});
	}

	checkExits() {
		const { exits } = this.config;
		if (!exits) return;
		const resolve = (to) => (typeof to === 'function' ? to(this) : to);
		if (exits.left && this.player.x < exits.left.at) this.goTo(resolve(exits.left.to));
		else if (exits.right && this.player.x > this.map.widthInPixels + exits.right.at) this.goTo(resolve(exits.right.to));
	}

	// --- Interactions --------------------------------------------------------------------

	// Interact button pressed while no dialog is open: act on what the player is touching
	handleInteract() {
		const priorities = [
			[this.treasures, (t) => this.onTreasure(t)],
			[this.doors, (d) => this.onDoor(d)],
			[this.npcs, (n) => this.onNpcInteract(n)],
			[this.cartells, (c) => this.dialog.show([c.text])],
			[this.bunny?.sprite, () => this.onBunny(this.bunny)],
		];
		for (const [target, action] of priorities) {
			const found = overlapping(this, target);
			if (found.length > 0) {
				found.forEach(action);
				return;
			}
		}
	}

	onTreasure(treasure) {
		if (treasure.opened) return;
		treasure.opened = true;
		treasure.setFrame(11);
		playChestSound(this);
		this.saveLevelState({ treasuresOpened: [...(this.levelState.treasuresOpened ?? []), treasure.name] });
		this.dialog.show([common.treasureFound(treasure.label)]);
		this.inventory.add(treasure.contents);
	}

	onDoor(door) {
		if (!door.opened && !this.inventory.has('key')) {
			this.dialog.show([common.doorLocked]);
			return;
		}
		if (!door.opened) {
			door.opened = true;
			this.inventory.remove('key');
		}

		const route = this.config.doors?.[door.name];
		if (!route) return;
		if (route.remember) {
			this.saveLevelState({ doorsOpened: [...(this.levelState.doorsOpened ?? []), door.name] });
		}
		this.goTo(route.to);
	}

	onNpcInteract() {}

	onBunny(bunny) {
		bunny.catch();
	}

	// --- Helpers shared by several levels ---------------------------------------------------

	// NPCs turn to face the player; Bug also changes pose when the player is near
	lookAtPlayer(npc, distance, defaultFlip = false) {
		npc.flipX = this.player.x > npc.x + npc.width / 2 ? defaultFlip : !defaultFlip;
		if (npc.name === 'Bug') {
			npc.setFrame(distance < BUG_FRAMES.nearDistance ? BUG_FRAMES.near : BUG_FRAMES.far);
		}
	}

	// Gently floats an NPC up and down (Peter Pan, the Genie)
	float(npc, amplitude) {
		this.tweens.add({ targets: npc, y: npc.y + amplitude, duration: 1200, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
	}

	distanceTo(obj) {
		return Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
	}

	// Bug (the dog) gives the player a stick the first time
	talkToBug(npc) {
		playSfx(this, 'audio_dog_bark', { volume: 0.5 });
		npc.setFrame(BUG_FRAMES.barking);
		if (this.inventory.has('pal')) {
			this.dialog.show([common.bugWithStick]);
			return;
		}
		this.dialog.show([common.bugGivesStick], () => {
			this.inventory.add(npc.contents);
			npc.contents = null;
			playChestSound(this);
		});
	}
}
