export default class Loading extends Phaser.Scene
{
    constructor()
    {
        super('Loading');
    }

    preload()
    {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading...', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5);
    }
}