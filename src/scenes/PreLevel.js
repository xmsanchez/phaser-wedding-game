export default class PreLevel extends Phaser.Scene
{
    constructor()
    {
        super('PreLevel');
        this.preLevelMilliseconds = 2000;
        // this.preLevelMilliseconds = 2500;
    }

    create(data)
    {
        const levelName = data.levelName;
        const levelKey = data.levelKey;
        const levelDesc = data.text;
        this.cameras.main.setBackgroundColor('#000'); // set background to black
        let level = this.add.text(400, 300, levelName, 
            { font: '42px monospace', align: 'center' })
            .setOrigin(0.5, 0);
        let levelTitle = this.add.text(400, 300, levelDesc, 
                { font: '90px monospace', align: 'center' })
                .setOrigin(0.5, -2);

        this.time.delayedCall(this.preLevelMilliseconds, () => {
            // Stop the pre-level scene and switch to the level scene
            this.scene.launch(levelKey);
            this.scene.stop('PreLevel');
            this.scene.bringToTop(levelKey);
        }, [], this);
        
    }
}