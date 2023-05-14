export default class PreLevel extends Phaser.Scene
{
    constructor()
    {
        super('PreLevel');
        this.preLevelMilliseconds = 500;
        // this.preLevelMilliseconds = 3000;
    }

    create(data)
    {
        this.cameras.main.setBackgroundColor('#000'); // set background to black
        let level = this.add.text(400, 300, data.levelKey.replace('Level', 'Nivell '), 
            { font: '42px monospace', align: 'center' })
            .setOrigin(0.5, 0);
        let levelTitle = this.add.text(400, 300, data.text, 
                { font: '90px monospace', align: 'center' })
                .setOrigin(0.5, -2);

        this.time.delayedCall(this.preLevelMilliseconds, () => {
            // Stop the pre-level scene and switch to the level scene
            this.scene.launch(data.levelKey);
            this.scene.stop('PreLevel');
            this.scene.bringToTop(data.levelKey);
        }, [], this);
        
    }
}