export default class HUD {
    constructor(scene) {
        this.scoreText = null;
        this.currentScore = 0;
        this.inventoryText = null;
        this.inventoryDisplay = scene.registry.get('inventoryDisplay');
        this.inventory = scene.registry.get('inventory');
    }

    destroy() {
        this.inventoryDisplay.removeAll(true);
        // Add any other cleanup code here...
        try {
            if (this.anims) {
                this.anims.destroy();
            }
            this.anims = undefined;
        } catch (error) {
            console.log('destroy: ' + error);
        }
      }
      
    addHud(scene) {
        const canvasWidth = scene.cameras.main.width;
        const canvasHeight = scene.cameras.main.height;
        console.log('Canvas height: ' + canvasHeight);
        console.log('Canvas width: ' + canvasWidth);
        
        // scene.joystick = new Joystick(scene, 300, (canvasHeight / 2) * 1.3);
        console.log('canvas width: ' + canvasWidth);
        this.inventoryText = scene.add.text((-canvasWidth / 2) + 70, -50, 'Inventari', { font: '50px Arial' }).setScrollFactor(0);
        this.inventoryDisplay = scene.add.container((-canvasWidth / 2) + 70, 0).setScrollFactor(0);
        
        // Creating a semi-transparent rectangle graphics for the background of the inventory
        const rect = scene.add.rectangle(0, 0, canvasWidth - 100, 120, 0x000000);
        rect.alpha = 0.3; // Change alpha for transparency (0 = fully transparent, 1 = fully opaque)
    
        // Create the container
        const container = scene.add.container(canvasWidth / 2, 80, [rect, this.inventoryText, this.inventoryDisplay]);
        container.setScrollFactor(0);
        
        // this.scoreText = scene.add.text(300, 25, 'Punts: 0', { font: '50px Arial' }).setScrollFactor(0);
        
        // Call updateInventory to create an initial empty inventory display
        this.updateInventory(scene);
    }
    
    updateInventory(scene, contents) {
        console.log('UPDATING INVENTORY');
        // console.log('This.inventory is: ' + this.inventory + '. New object to add: ' + contents);
        const tileSize = 16 * 3;
        const spacing = 5 * 3;

        if(contents !== undefined){
            console.log('Object received: ' + JSON.stringify(contents));
        }

        let frame = 0;

        // Loop through the inventory array and create the display
        for (let i = 0; i < this.inventory.length; i++) {
            var currentObject = this.inventory[i];
            if(currentObject == 'key'){
                frame = 18;
            }else if(currentObject == 'map'){
                frame = 8;
            }else if(currentObject == 'clock'){
                frame = 5;
            }else if(currentObject == 'bruixola'){
                frame = 30;
            }
            const item = scene.add.sprite(i * (tileSize + spacing), 0, 'objects', frame).setOrigin(0, 0).setScale(3);
            scene.hud.inventoryDisplay.add(item);
            scene.registry.set('inventory', this.inventory);
            scene.registry.set('inventoryDisplay', this.inventoryDisplay);
            console.log('Current inventory: ' + this.inventory);
        }
    }

    updateScore(scene) {
        this.currentScore += 10;
        this.scoreText.setText('Punts: ' + this.currentScore);
    }

    // This is to display on messages
    createButtonIcon = function (scene, x, y, buttonText) {
		console.log('Add button icon at ' + x + ', ' + y + ' with text ' + buttonText);
        var btn = scene.add.circle(x, y, 10, 0xFF0000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '24px Arial',
            fill: '#ffffff'
        };
        var text = buttonText;
        var textElement = scene.add.text(x, y, text, textStyle).setOrigin(0.5);
        textElement.scrollFactorX = 0;
        textElement.scrollFactorY = 0;

        // Create a container to group the circle and text
        var container = scene.add.container(0, 0, [btn, textElement]);
        container.setSize(btn.width, btn.height);

        // Enable touch input on the container
        container.setInteractive({ useHandCursor: true });
		
		scene.add.container(x, y, [btn, textElement]);
    }
}