export default class Level1 extends Phaser.Scene
{
	constructor()
	{
		super('Level1');
		this.jumpKeyReleased = true;
	}

	preload()
    {
		// Load assets
		this.load.image('sky', 'images/sky.png');
		this.load.image('forest_rocks','assets/tilesets/Forest_rocks.png');
		this.load.image('forest_rocks2','assets/tilesets/Forest_rocks2.png');
		this.load.image('trees','assets/tilesets/Trees.png');
		this.load.image('background','assets/tilesets/background.png');

		// Load music
		this.load.audio('background_music', 'assets/audio/tangled.mp3');

		// Load map
		this.load.tilemapTiledJSON('map', 'assets/maps/map_level1.json');

		// Load other assets
		this.load.spritesheet('player',
			'assets/spritesheets/player.png',
			{ frameWidth: 16, frameHeight: 16 }
		);
    }

	create()
	{
		this.loadMusic();

		this.add.tileSprite(0, 0, 3000, 600, 'sky').setOrigin(0, 0);

		// Create the tilemap using the loaded JSON file
		const map = this.make.tilemap({ key: 'map' });
	
		// Add the loaded tiles image asset to the map
		const tileset_rocks = map.addTilesetImage('Forest_rocks', 'forest_rocks');
		const tileset_rocks2 = map.addTilesetImage('Forest_rocks2', 'forest_rocks2');

		const tileset_trees = map.addTilesetImage('Trees', 'trees');

		const tileset_bg = map.addTilesetImage('background', 'background');
	
		const sky_background = map.createLayer('sky_mountains', tileset_bg);
		const sky_foreground = map.createLayer('sky_foreground', tileset_bg);
		const sky_mountains = map.createLayer('sky_mountains', tileset_bg);
		const sky_mountains_ground = map.createLayer('sky_mountains_ground', tileset_bg);

		//const ground = map.createLayer('ground', tileset_rocks);
		const ground_bg = map.createLayer('ground_background', tileset_rocks2);
		const ground = map.createLayer('ground', [tileset_rocks, tileset_rocks2]);
		const ground_grass = map.createLayer('grass', tileset_rocks);

		const trees1 = map.createLayer('trees', [tileset_trees]);
		const trees2 = map.createLayer('trees2', [tileset_trees]);

		const bridge = map.createLayer('bridge', tileset_rocks2);

		const platforms = map.createLayer('platforms', tileset_rocks);

		const walls = map.createLayer('walls', tileset_rocks);
		const ladders = map.createLayer('ladder', tileset_rocks);

        //Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 1000, true, true, 'ground');
		map.setCollisionBetween(1, 1000, true, true, 'platforms');
		map.setCollisionBetween(1, 1000, true, true, 'walls');

		// Enable physics for the scene (e.g., using Arcade Physics)
		this.physics.world.setBoundsCollision(true, true, true, true);
	
		// Add other game objects or custom logic here
		this.player = this.physics.add.sprite(170, 270, 'player').setScale(1).refreshBody();
		this.player.setBounce(0.1);
		this.player.setCollideWorldBounds(true);

		// this.physics.world.createDebugGraphic();

		this.physics.add.collider(this.player, ground);
		this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.player, walls);

		ground.setCollisionBetween(1, 1);

		this.createAnimations(this);
	}
	

    update() {
		// Add movement to the player
		this.playerMovement(this);
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

	//////////////////////
	// Helper functions //
	//////////////////////
	playerMovement(scene) {
		const acceleration = 800; // Higher value for more aggressive acceleration
		const drag = 800; // Higher value for more aggressive deceleration
		const maxVelocityX = 200;
		const jumpVelocity = -450;
	
		scene.cursors = scene.input.keyboard.createCursorKeys();
	
		if (scene.cursors.left.isDown) {
			scene.player.setAccelerationX(-acceleration);
			if (scene.player.body.velocity.x < -maxVelocityX) {
				scene.player.setVelocityX(-maxVelocityX);
			}
			scene.player.anims.play('left', true);
		} else if (scene.cursors.right.isDown) {
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

		// Check if jump key is released
		if (!scene.cursors.space.isDown && !scene.cursors.up.isDown) {
			this.jumpKeyReleased = true;
		}

		// Player can jump while walking any direction by pressing the space bar
		// or the 'UP' arrow, but only if the jump key was released
		if ((scene.cursors.space.isDown || scene.cursors.up.isDown) && scene.player.body.onFloor() && this.jumpKeyReleased) {
			scene.player.setVelocityY(jumpVelocity);
			scene.player.play('jump', true);
			this.jumpKeyReleased = false;
		}
	}

	loadMusic(){
		// Create an instance of the audio object
		const backgroundMusic = this.sound.add('background_music', { loop: true });
		// Play the audio file
		backgroundMusic.play();
	}
}
