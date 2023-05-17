export default class HUD {
    constructor(scene) {
        this.scoreText = null;
        this.currentScore = 0;
        this.inventoryText = null;
        this.inventoryDisplay = null;
		this.inventory = [];
    }

    addHud(scene) {
		const canvasWidth = scene.cameras.main.width;
		const canvasHeight = scene.cameras.main.height;
		console.log('Canvas height: ' + canvasHeight);
		console.log('Canvas width: ' + canvasWidth);
		
		// scene.joystick = new Joystick(scene, 300, (canvasHeight / 2) * 1.3);
        this.scoreText = scene.add.text(250, (canvasHeight / 2) * 0.6, 'Punts: 0', { font: '18px Arial' }).setScrollFactor(0);
        this.inventoryText = scene.add.text(canvasWidth / 1.7, (canvasHeight / 2) * 0.6, 'Inventari', { font: '18px Arial' }).setScrollFactor(0);
        this.inventoryDisplay = scene.add.container(canvasWidth / 1.5, (canvasHeight / 2) * 0.6 + 30).setScrollFactor(0);

        // Call updateInventory to create an initial empty inventory display
        this.updateInventory(scene);
    }
    
    updateInventory(scene, contents) {
        // Clear the previous inventory display
        this.inventoryDisplay.removeAll(true);

        const tileSize = 16;
        const spacing = 5;

        if(contents !== undefined){
            console.log('Contents: ' + JSON.stringify(contents));
        }

        let frame = 0;
        if(contents == 'key'){
            frame = 18;
        }else if(contents == 'map'){
            frame = 8;
        }

        // Loop through the inventory array and create the display
        for (let i = 0; i < this.inventory.length; i++) {
            const item = scene.add.sprite(-i * (tileSize + spacing), 0, 'objects', frame).setOrigin(0, 0).setScale(1);
            this.inventoryDisplay.add(item);
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