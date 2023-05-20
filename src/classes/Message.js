export default class Message {
    constructor(scene) {
		this.messageBox = [];
		this.scene = scene;
	}

    showMessageList(scene, messages) {
        console.log('Show messages: ' + JSON.stringify(messages));
        let currentIndex = 0;
        if (currentIndex < messages.length) {
            scene.showMessage(this, messages[currentIndex]);
            console.log('Show first message: ' + messages[currentIndex]);
            scene.interactBtn.once('pointerdown', () => {
                scene.messageDisplaying = false;
                scene.destroyMessageBox();
                currentIndex++;
                console.log('Destroyed message ' + currentIndex);
                scene.showMessage();
            });
        }
    }

    showMessageSelector(scene, messageList) {
        const padding = 20;
        const boxWidth = this.scene.cameras.main.width / 2.3 - padding * 2;
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const boxX = centerX - boxWidth / 2;
      
        const textConfig = {
          fontSize: '18px',
          fill: '#ffffff',
          wordWrap: { width: boxWidth - padding * 2, useAdvancedWrap: true },
          fixedWidth: boxWidth - padding * 2,
          align: 'left',
        };
      
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.setScrollFactor(0);
        graphics.fillRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
        graphics.lineStyle(4, 0xffffff);
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
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
        graphics.lineStyle(4, 0xffffff);
        graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        let currentY = boxY + padding; // Update optionsY based on new boxY
        optionTexts.forEach((text, index) => {
          text.setY(currentY);
          currentY += text.height + padding; // Adjusted to include padding
          scene.messageSelectorTextObjects.push(text);
        });
      
        const additionalTextConfig = {
          font: 'italic 14px',
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
      
    

    showMessage(scene, message) {
        const padding = 20;
        const boxWidth = this.scene.cameras.main.width / 2.3 - padding * 2;
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const boxX = centerX - boxWidth / 2;
    
        const textConfig = {
            fontSize: '18px',
            fill: '#ffffff',
            wordWrap: { width: boxWidth - padding * 2, useAdvancedWrap: true },
        };
    
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.setScrollFactor(0);
        graphics.fillRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
        graphics.lineStyle(4, 0xffffff);
        graphics.strokeRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
    
        const text = this.scene.add.text(centerX, centerY, message, textConfig);
        text.setOrigin(0.5);
        text.setScrollFactor(0);
    
        const textHeight = text.height + padding * 2;
        const boxHeight = Math.max(textHeight + 30, 100);
        const boxY = centerY - boxHeight / 2;
    
        graphics.clear();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
        graphics.lineStyle(4, 0xffffff);
        graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
        text.setY(centerY - 10); // Adjust the text Y position based on the new box height
    
        const additionalTextConfig = {
            font: 'italic 14px',
            fill: '#ffffff',
        };
    
        const additionalText = this.scene.add.text(centerX, boxY + boxHeight + padding, "Prem 'B' per continuar", additionalTextConfig);
        additionalText.setOrigin(0.5, 0);
        additionalText.y = boxY + boxHeight - 30;

        additionalText.setScrollFactor(0);
    
        this.messageBox.push(graphics, text, additionalText);
        this.scene.messageDisplaying = true;
    }
    
    destroyMessageBox() {
        this.scene.messageDisplaying = false;
        if (this.messageBox && this.messageBox.length > 0) {
        this.messageBox.forEach(element => {
            element.destroy();
        });
        this.messageBox = [];
        }
    }
}