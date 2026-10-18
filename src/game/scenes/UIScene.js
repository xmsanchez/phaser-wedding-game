import DialogBox from '../core/DialogBox.js';
import Hud from '../core/Hud.js';
import InputController from '../core/InputController.js';
import Inventory from '../core/Inventory.js';

// Overlay running on top of every level: controls, inventory bar and dialogs.
// The interact input either advances the open dialog or emits 'action' for the level.
export default class UIScene extends Phaser.Scene {
	constructor() {
		super('UIScene');
	}

	create() {
		// Hidden until the level is ready (see BaseLevel.create)
		this.scene.setVisible(false);

		this.controls = new InputController(this);
		this.inventory = new Inventory(this.registry);
		this.hud = new Hud(this, this.inventory);
		this.dialog = new DialogBox(this);

		this.controls.on('interact', () => {
			if (this.dialog.isOpen) this.dialog.advance();
			else this.events.emit('action');
		});

		this.events.once('shutdown', () => {
			this.controls.destroy();
			this.hud.destroy();
			this.dialog.destroy();
		});
	}

	setControlsVisible(visible) {
		this.controls.setVisible(visible);
	}
}
