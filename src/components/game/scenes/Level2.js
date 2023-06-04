import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';

////////////////////////////////////////////////////////
// EL CONILL
////////////////////////////////////////////////////////
export default class Level2 extends Phaser.Scene
{
	constructor()
	{
		super('Level2');

		this.jumpKeyReleased = true;
		this.jump = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.score = 0;
		this.player = null;
		this.joystick = null;
		this.startScene = false;
		this.currentScene = 'Level2';
		
		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;

		this.common = null;

		// Bunny related variables
		this.bunnies = null;
		this.pathPoints = null;
		this.bunnyReverseFlag = false;
		this.bunnyCatched = false;
		this.bunny = null;

		this.levelFinished = false;
		this.firstInteraction = true;
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
		this.map = this.make.tilemap({ key: 'level2' });
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('swamp', 'swamp');
		const tileset_bg = this.map.addTilesetImage('swamp_bg', 'swamp_bg');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg2', tileset_bg, 0.6);
		this.common.createLevelLayer(this, 'bg1', tileset_bg, 0.7);
		this.common.createLevelLayer(this, 'fg_background', tileset_bg, 0.8);
		this.common.createLevelLayer(this, 'ground_bg', tileset, 0.9);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		this.common.createLevelLayer(this, 'rocks', tileset);
		this.common.createLevelLayer(this, 'decorations', tileset);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.bunny = this.common.spawnBunny(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 5000);
		
		this.common.loadMusic(this, tileset.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);
	}

    update() {
		// Update player movement based on events
		this.player.playerMovement(this);

		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.bunnies, this);

		this.bunnies.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 75) {		
				if(this.firstInteraction){
					this.firstInteraction = false;
				}
			}

			if(!this.firstInteraction){
				this.bunny.container.y = this.bunny.y - 20;
				this.common.bunnyMovement(this);
			}
		});

		if(this.bunny.contents == null && !this.message.messageDisplaying){
			// Set a timeout before showing the message.
			setTimeout(() => {
				console.log('We can start the next level!');
				// this.message.showMessageList(this, ['Felicitats! Ja tens el **rellotge**.\nPodràs aconseguir la resta de coses?']);
				this.levelFinished = true;
			}, 100);
		}
		if(this.levelFinished && !this.message.messageDisplaying){
			setTimeout(() => {
				this.startScene = false;
				this.registry.set('previousScene', this.scene.key);
				this.common.stopScene(this);
				this.scene.start('PreLevel', { levelName: '', timeout: 4500, textSize: 38, levelKey: 'Level3Prev', text: 'Amb el mapa i el rellotge,\nja en el teu poder, vas\ncamí de tornada a casa...' });
			}, 4000);
		}
    }
}
