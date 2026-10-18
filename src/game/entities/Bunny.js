import { createBunnyAnimations } from '../systems/animations.js';
import { drawHint } from '../systems/spawners.js';
import { playChestSound } from '../systems/audio.js';
import { common } from '../data/dialogs.ca.js';

const prop = (object, name) => object.properties?.find((p) => p.name === name)?.value;

// The White Rabbit: runs along the 'objectPath' points of the map and flees from the player
export default class Bunny {
	// Spawns the bunny from the 'bunny' object layer, or returns null if the map has none
	static spawn(scene) {
		const data = scene.map.getObjectLayer('bunny')?.objects?.[0];
		if (!data) return null;
		return new Bunny(scene, data);
	}

	constructor(scene, data) {
		this.scene = scene;
		this.group = scene.physics.add.staticGroup();

		const sprite = scene.physics.add.sprite(data.x, data.y, 'npc_bunny', 0).setOrigin(0, 1);
		sprite.name = data.name;
		sprite.contents = prop(data, 'contains');
		sprite.container = drawHint(scene, sprite);
		sprite.body.setAllowGravity(true);
		this.group.add(sprite);
		this.sprite = sprite;

		const path = scene.map.getObjectLayer('objectPath')?.objects ?? [];
		this.initialPath = [...path];
		this.path = [...path];
		this.reverseFlag = false;
		this.caught = false;

		createBunnyAnimations(scene);
		sprite.flipX = false;
	}

	get name() {
		return this.sprite.name;
	}

	// Chase logic (Level2), called every frame once the chase has started
	update() {
		const { scene, sprite } = this;
		const { player } = scene;

		// The player fell off the map: put both back at the start
		if (player.y > scene.cameras.main.height - 800) {
			player.x = 750;
			player.y = 100;
			sprite.x = 800;
			sprite.y = 100;
			this.path = [...this.initialPath];
		}

		if (this.caught) {
			sprite.setVelocity(0, 0);
			sprite.anims.play('bunny-idle', true);
			sprite.body.setAllowGravity(true);
			sprite.body.gravity.y = 6000;
			return;
		}
		if (this.path.length === 0) return;

		const playerDistance = Phaser.Math.Distance.Between(player.x, player.y, sprite.x, sprite.y);
		const speed = playerDistance > 150 || sprite.x > 1250 ? 170 : 300;

		// Run the path backwards while the player is close
		if (playerDistance < 90 && !this.reverseFlag) {
			this.reverseFlag = true;
			this.path.reverse();
		} else if (playerDistance > 90 && this.reverseFlag) {
			this.reverseFlag = false;
			this.path.reverse();
		}

		const point = this.path[0];
		if (Phaser.Math.Distance.Between(sprite.x, sprite.y, point.x, point.y) < 15) {
			this.path.push(this.path.shift());
		}
		scene.physics.moveToObject(sprite, this.path[0], speed);
		sprite.container.x = sprite.x;
		sprite.container.y = sprite.y - 20;

		if (sprite.body.velocity.x < 0) {
			sprite.flipX = false;
			sprite.anims.play('bunny-left', true);
		} else if (sprite.body.velocity.x > 0) {
			sprite.flipX = true;
			sprite.anims.play('bunny-right', true);
		}
	}

	// The player caught the bunny: it hands over the clock
	catch(onGranted) {
		const { scene, sprite } = this;
		this.caught = true;
		scene.dialog.show(common.bunnyCaught(sprite.name), () => {
			if (sprite.contents == null) return;
			scene.inventory.add(sprite.contents);
			sprite.contents = null;
			playChestSound(scene);
			onGranted?.();
		});
	}
}
