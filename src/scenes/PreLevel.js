export default class PreLevel extends Phaser.Scene
{
    constructor()
    {
        super('PreLevel');
        this.preLevelMilliseconds = 2000;
        // this.preLevelMilliseconds = 2500;
    }

    launchScene(data) {
        this.scene.launch('UIScene', { mainScene: this });
        this.scene.launch(data.levelKey);
        this.scene.stop('PreLevel');
    }

    create(data)
    {
        const levelName = data.levelName;
        const levelKey = data.levelKey;
        const levelDesc = data.text;
        let levelTextSize = data.textSize;
        let timeout = data.timeout;
        if(levelTextSize == null){
            levelTextSize = 90;
        }
        if(timeout != null){
            this.preLevelMilliseconds = timeout;
        }

        if(levelName === undefined){
            this.launchScene({ levelName: levelName, levelKey: levelKey, text: levelDesc });
        }else{
            this.cameras.main.setBackgroundColor('#000'); // set background to black
            this.add.text(400, 300, levelName, 
                { font: '42px monospace', align: 'center' })
                .setOrigin(0.5, 0);
            this.add.text(400, 300, levelDesc, 
                { font: levelTextSize + 'px monospace', align: 'center' })
                .setOrigin(0.5, -2);

            this.time.delayedCall(this.preLevelMilliseconds, () => {
                // Stop the pre-level scene and switch to the level scene
                this.launchScene({ levelName: levelName, levelKey: levelKey, text: levelDesc });
            }, [], this);
        }
    }
}