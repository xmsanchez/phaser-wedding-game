export default class Loading {
    constructor(scene) {
	}
	
    loadAssets(scene) {
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
		const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;

		var progressBar = scene.add.graphics();
		var progressBox = scene.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, screenCenterY - 50, 320, 50);

		scene.load.on('progress', function (value) {
			console.log(value);
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(250, screenCenterY - 40, 300 * value, 30);
		});

		var assetText = scene.make.text({
			x: screenCenterX,
			y: screenCenterY + 50,
			text: '',
			style: { font: '18px monospace' }
		});
		assetText.setOrigin(0.5, 0.5);
					
		scene.load.on('fileprogress', function (file) {
			assetText.setText('Loading asset: ' + file.key);
		});

		scene.load.on('complete', () => {
			progressBar.destroy();
			progressBox.destroy();
			assetText.destroy();
			scene.events.emit('loaded');
		});
    }
}