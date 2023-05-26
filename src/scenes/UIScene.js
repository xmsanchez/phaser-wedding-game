import Joystick from '../classes/Joystick.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        console.log('UIScene constructor');
    }

    init(data) {
        this.mainScene = data.mainScene;
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
    }
}
