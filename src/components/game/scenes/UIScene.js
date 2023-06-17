import Joystick from '../classes/Joystick.js';
import HUD from '../classes/HUD.js';
import Message from '../classes/Message.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    init(data) {
        this.mainScene = data.mainScene;
    }

    preload() {
    }

    create() {
        this.scene.setVisible(false);
        
        console.log('UIScene create');
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;
        this.input.addPointer(1);
        this.joystick = new Joystick(this, 150, (canvasHeight / 2) * 1.7);
		this.jumpBtn = this.joystick.createJumpButton(this, canvasWidth - 150, (canvasHeight / 2) * 1.7);
		this.interactBtn = this.joystick.createInteractButton(this, canvasWidth - 360, (canvasHeight / 2.2) * 2);
		console.log('Joystick:', this.joystick);
        console.log('InteractBtn:', this.interactBtn);


        this.scene.bringToTop();

        this.registry.set('joystick', this.joystick);
        this.registry.set('interactBtn', this.interactBtn);
        this.registry.set('jumpBtn', this.jumpBtn);
        this.registry.set('UI', this);

		this.hud = new HUD(this);
		this.hud.addHud(this);
        
        this.message = new Message(this);

        this.registry.set('HUD', this.hud);
        this.registry.set('Message', this.message);
    }

    toggleUIVisibility(visible) {
        this.joystick.joystick.setVisible(false);
        this.jumpBtn.setVisible(visible);
        this.interactBtn.setVisible(visible);
    }
}
