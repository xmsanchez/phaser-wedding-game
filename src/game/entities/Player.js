import { createPlayerAnimations } from '../systems/animations.js';

const ACCELERATION = 500;
const DRAG = 1200;
const MAX_VELOCITY_X = 180;
const JUMP_VELOCITY = -450;

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setBounce(0.1);
		this.setCollideWorldBounds(true);
		this.setDragX(DRAG);
		createPlayerAnimations(this);

		this.lastMove = 'idle';
		this.footsteps = scene.sound.add('audio_footsteps', { volume: 0.3 });
		scene.events.once('shutdown', () => this.footsteps.destroy());
	}

	// Called every frame by the level. While a dialog is open the player stands still.
	update(controls, frozen) {
		const direction = frozen ? 0 : (controls.left ? -1 : 0) || (controls.right ? 1 : 0);

		if (direction === 0) {
			this.setAccelerationX(0);
			this.anims.play(this.lastMove, true);
			return;
		}

		const side = direction < 0 ? 'Left' : 'Right';
		this.lastMove = 'idle' + side;
		this.setAccelerationX(direction * ACCELERATION);
		if (direction * this.body.velocity.x > MAX_VELOCITY_X) {
			this.setVelocityX(direction * MAX_VELOCITY_X);
		}

		if (this.body.onFloor()) {
			this.anims.play(side.toLowerCase(), true);
			if (!this.footsteps.isPlaying) this.footsteps.play();
		} else {
			this.anims.play('jump' + side, true);
		}
	}

	jump() {
		if (!this.body.onFloor()) return;
		this.setVelocityY(JUMP_VELOCITY);
		this.anims.play('jump', true);
	}
}
