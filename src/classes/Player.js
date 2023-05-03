export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
    }

	playerMovement(scene) {
		const acceleration = 600; // Higher value for more aggressive acceleration
		const drag = 1200; // Higher value for more aggressive deceleration
		const maxVelocityX = 220;
		const jumpVelocity = -450;

		this.setKeyboardControls(scene);
		this.setTouchControls(scene);
	
		// Player can jump while walking any direction by pressing the space bar
		// or the 'UP' arrow, but only if the jump key was released
		if (this.jump && scene.player.body.onFloor() && this.jumpKeyReleased) {
			scene.player.setVelocityY(jumpVelocity);
			scene.player.play('jump', true);
			this.jump = false;
			this.jumpKeyReleased = false;
		}
		
		// Check if jump key is released
		if (!scene.cursors.space.isDown && !scene.cursors.up.isDown) {
			this.jumpKeyReleased = true;
		}

		if (this.moveLeft) {
			scene.player.setAccelerationX(-acceleration);
			if (scene.player.body.velocity.x < -maxVelocityX) {
				scene.player.setVelocityX(-maxVelocityX);
			}
			scene.player.anims.play('left', true);
		} else if (this.moveRight) {
			scene.player.setAccelerationX(acceleration);
			if (scene.player.body.velocity.x > maxVelocityX) {
				scene.player.setVelocityX(maxVelocityX);
			}
			scene.player.anims.play('right', true);
		} else {
			// If no keys are pressed, the player decelerates
			scene.player.setAccelerationX(0);
			scene.player.setDragX(drag);
			scene.player.anims.play('idle', true);
		}
	}

	setTouchControls(scene) {
		var cursorKeys = scene.joystick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
				console.log(name);
                s += `${name} `;
				if (name == 'left') {
					this.moveLeft = true;
					this.moveRight = false;
				}
				if (name == 'right') {
					this.moveRight = true;
					this.moveLeft = false;
				}
            }
        }

		// Add a listener for the 'pointerup' event, which fires when the button is released
		scene.interactBtn.on('pointerdown', () => {
			console.log('Jump!')
			this.jump = true;
			// Add any other functionality you want the button to perform here
		});
	}
	
	setKeyboardControls(scene) {
		// Keyboard ccontrols
		scene.cursors = scene.input.keyboard.createCursorKeys();
	
		if (scene.cursors.left.isDown) {
			this.moveLeft = true;
			this.moveRight = false;
		} else if (scene.cursors.right.isDown) {
			this.moveRight = true;
			this.moveLeft = false;
		} else {
			// If no keys are pressed, the player decelerates
			this.moveLeft = false;
			this.moveRight = false;
		}

		// Check if jump key is released
		if (!scene.cursors.space.isDown && !scene.cursors.up.isDown) {
			this.jumpKeyReleased = true;
		}

		// Player can jump while walking any direction by pressing the space bar
		// or the 'UP' arrow, but only if the jump key was released
		if ((scene.cursors.space.isDown || scene.cursors.up.isDown) && scene.player.body.onFloor() && this.jumpKeyReleased) {
			this.jump = true;
		}
	}

	createAnimations(scene){

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'climb',
			frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'player', frame: 1 }],
			frameRate: 20
		});
	}
}