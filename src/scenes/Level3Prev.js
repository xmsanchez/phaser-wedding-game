import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';
import Message from '../classes/Message.js';

export default class Level3Prev extends Phaser.Scene
{
	constructor()
	{
		super('Level3Prev');

		this.jumpKeyReleased = true;
		this.jump = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.score = 0;
		this.player = null;
		this.joystick = null;		this.firstInteraction = true;
		this.bunnyFirstInteractionJump = false;

		this.startScene = false;
		this.currentScene = 'Level3Prev';
		
		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		// Bunny related variables
		this.pathPoints = null;
		this.bunnyReverseFlag = false;
		this.bunnyCatched = false;

		this.common = null;
	}

	preload()
    {}

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'house-outside'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('house-outside', 'house-outside');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_background', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		
		this.physics.world.setBounds(-30, 0, this.map.widthInPixels + 30, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnCartells(this);
		this.bunny = this.common.spawnBunny(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 1400);
		this.loadMusic();

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
	}

    update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		this.bunnies.getChildren().forEach((bunny) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, bunny.x, bunny.y);
			if (distance < 125) {		
				this.playerLookDirection(bunny);
				this.messageListShowing = [];
				
				setTimeout(() => {
					// For first interaction, show a message list when approaching NPCs
					if(this.firstInteraction && !this.message.messageDisplaying){
						this.messageListShowing = [
							bunny.name + ': Oh, no! Vaig tard, vaig tard.', 
							bunny.name + ': Aquest rellotge marca **el dia i la hora** del casament. Vaig tard, vaig tard!!'
						];
						this.message.showMessageList(this, this.messageListShowing);
						this.firstInteraction = false;
						setTimeout(() => {
							this.bunny.setVelocityY(-350);	
						}, 400);
					}	
				}, 400);
				
				setTimeout(() => {
					if(!this.message.messageDisplaying && this.messageListShowing.length == 0){
						bunny.flipX = false;
						bunny.anims.play('bunny-left', true);
						bunny.setVelocityX(-200);
					}
				}, 800);
			}
		});

		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.cartells, this);

		// If player goes out of the screen to the left, start next scene
		if(this.player.x < 0){
			console.log('Stop scene Level3Prev, start scene Level3');
			this.startScene = false;
			this.hud.destroy();
			this.scene.stop('Level3Prev');
			this.backgroundMusic.stop();
			this.scene.start('PreLevel', { levelKey: 'Level3', text: "L\'hora" });
		}
    }

	playerLookDirection(bunny) {
		if(this.player.x > bunny.x + bunny.width / 2){
			this.player.setFrame(10);
		}else{
			this.player.setFrame(7);
		}
	}

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music_bunny1', { loop: true, volume: 0.4});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
