export default class Message {
    constructor(scene) {
		this.messageBox = [];
		this.scene = scene;

		this.messageDisplaying = false;
		this.messageIsSelector = false;
		this.messageSelectorTexts = [];
		this.messageSelectorTextObjects = [];
		this.messageListShowing = [];
	}

    setScene(scene) {
        this.scene = scene;    
    }

    // Iteratively show messages from a list
    showMessageList(scene, messages, callback) {
        // console.log('Show messages. Messages.length: ' + messages.length);
        if (messages.length != 0) {
            this.showMessage(scene, messages[0]);
            scene.interactBtn.once('pointerdown', () => {
                messages.shift();
                this.destroyMessageBox();
                //check if there are any more messages to display
                this.showMessageList(scene, messages, callback);
            });
        }
        // console.log('Messages.length: ' + messages.length);
        if(messages.length == 1 && (callback != null || callback != undefined)){
            callback(scene);
        }
    }    

    showMessageSelector(scene, messageList) {
        const currentZoom = scene.cameras.main.zoom;
        const padding = 20;
        const boxWidth = this.scene.cameras.main.width / currentZoom - padding * 2;
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY - 80;
        const boxX = centerX - boxWidth / 2;
      
        const textConfig = {
          fontSize: '18px',
          fill: '#ffffff',
          wordWrap: { width: boxWidth - padding * 2, useAdvancedWrap: true },
          fixedWidth: boxWidth - padding * 2,
          align: 'left',
        };
      
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 0.85);
        graphics.setScrollFactor(0);
        graphics.fillRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
      
        const optionsY = centerY + padding;
      
        const optionTexts = messageList.map((message, index) => {
          const optionY = optionsY + index * (padding + 20);
          const text = this.scene.add.text(boxX + padding, optionY, message, textConfig);
          text.setScrollFactor(0);
          return text;
        });
      
        const textHeight = optionTexts.reduce((height, text) => height + text.height + padding, 0);

        const boxHeight = Math.max(textHeight + padding * 2, 100);
        const boxY = centerY - boxHeight / 2;
        
        graphics.clear();
        graphics.fillStyle(0x000000, 0.85);
        graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        let currentY = boxY + padding; // Update optionsY based on new boxY
        optionTexts.forEach((text, index) => {
          text.setY(currentY);
          currentY += text.height + padding; // Adjusted to include padding
          scene.messageSelectorTextObjects.push(text);
        });
      
        const additionalTextConfig = {
          font: 'italic 28px',
          fill: '#ffffff',
        };
      
        const additionalText = this.scene.add.text(centerX, boxY + boxHeight + padding, "Press 'B' to continue", additionalTextConfig);
        additionalText.setOrigin(0.5, 0);
        additionalText.y = boxY + boxHeight - additionalText.height - padding; // Adjusted y position to fit within the box
        additionalText.setScrollFactor(0);
        
        this.messageBox.push(graphics, ...optionTexts, additionalText);
        this.scene.messageDisplaying = true;
        this.scene.messageIsSelector = true;
    }

    showMessageWithRex(scene, message, callback) {
        
    }
      
    showMessage(scene, message, callback) {
        message = message.replace(/\*\*(.*?)\*\*/g, '[color=#ff0000][b]$1[/b][/color]');

        console.log('Show message: ' + message);
        const padding = 20;
        const boxWidth = this.scene.cameras.main.width - 50;
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY - 80;
        const boxX = centerX - boxWidth / 2;
    
        const textConfig = {
            fontSize: '52px',
            fill: '#ffffff',
            wrap: {
                mode: 'word', // Wrap by word
                width: boxWidth - padding * 2 // Set the wrap width
            }
        };
    
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 0.85);
        graphics.setScrollFactor(0);
        graphics.fillRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
        
        const text = this.scene.add.rexBBCodeText(centerX, centerY, message, textConfig);
        text.style.wrapMode = 1;
        text.style.width = 5;
        console.log('Wrap mode: ' + text.style.wrapMode)
        // text.setWordWrapWidth(5);
        text.setOrigin(0.5);
        text.setScrollFactor(0);
    
        const textHeight = text.height + padding * 2;
        const boxHeight = Math.max(textHeight + 60, 100);
        const boxY = centerY - boxHeight / 2;
    
        graphics.clear();
        graphics.fillStyle(0x000000, 0.85);
        graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
        text.setY(centerY - 10); // Adjust the text Y position based on the new box height
    
        // const additionalTextConfig = {
        //     font: 'italic 28px',
        //     fill: '#ffffff',
        // };
        const additionalTextConfig = {
            fontSize: '32px',
            fill: '#ffffff',
            wrap: {
                mode: 'word', // Wrap by word
                width: boxWidth - padding * 2 // Set the wrap width
            }
        };
    
        const additionalText = this.scene.add.rexBBCodeText(centerX, centerY, "Prem [color=#ff0000][b][i]B[/i][/b][/color] per continuar", additionalTextConfig);
        // const additionalText = this.scene.add.text(centerX, boxY + boxHeight + padding, "Prem 'B' per continuar", additionalTextConfig);
        additionalText.setOrigin(0.5, 0);
        additionalText.y = boxY + boxHeight - 45;

        additionalText.setScrollFactor(0);
    
        this.messageBox.push(graphics, text, additionalText);
        this.messageDisplaying = true;

        if(callback != null || callback != undefined){
            callback(scene);
        }
    }
    
    destroyMessageBox() {
        console.log('Destroy messageBox');
        this.messageIsSelector = false;
        this.messageDisplaying = false;
        if (this.messageBox && this.messageBox.length > 0) {
        this.messageBox.forEach(element => {
            console.log('Destroying element ' + element);
            element.destroy();
        });
        this.messageBox = [];
        }
    }
}