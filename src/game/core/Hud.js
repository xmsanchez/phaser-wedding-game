import { itemFrame } from '../data/items.js';
import { mainMenu } from '../data/dialogs.ca.js';

const TILE_SIZE = 16 * 3;
const SPACING = 5 * 3;

// Inventory bar at the top of the screen; redraws itself when the inventory changes
export default class Hud {
	constructor(scene, inventory) {
		this.scene = scene;
		const width = scene.cameras.main.width;

		const background = scene.add.rectangle(0, 0, width - 100, 120, 0x000000).setAlpha(0.3);
		const label = scene.add.text(-width / 2 + 70, -50, mainMenu.inventory, { font: '50px Arial' });
		this.items = scene.add.container(-width / 2 + 70, 0);
		this.container = scene.add.container(width / 2, 80, [background, label, this.items]).setScrollFactor(0);

		this.unsubscribe = inventory.onChange((items) => this.render(items));
		this.render(inventory.items);
	}

	render(items) {
		this.items.removeAll(true);
		items.forEach((item, i) => {
			const sprite = this.scene.add.sprite(i * (TILE_SIZE + SPACING), 0, 'objects', itemFrame(item));
			this.items.add(sprite.setOrigin(0, 0).setScale(3));
		});
	}

	setVisible(visible) {
		this.container.setVisible(visible);
	}

	destroy() {
		this.unsubscribe();
	}
}
