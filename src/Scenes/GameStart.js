class StartScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("aKey", "aKey.png");
        this.load.image("sKey", "sKey.png");
        this.load.image("upArrow", "upKey.png");
        this.load.image("downArrow", "downKey.png");
        this.load.image("leftArrow", "leftKey.png");
        this.load.image("rightArrow", "rightKey.png");

        this.load.image("player", "player.png")

        this.load.image("infectedFrame1", "monsterGreen1.png");
        this.load.image("infectedFrame2", "monsterGreen2.png");

        this.load.image("cubeMonsterFrame1", "monster6.png");
        this.load.image("cubeMonsterFrame2", "monster7.png");

        this.load.image("healBullet", "laserGreen.png");
        this.load.image("killBullet", "laserRed.png");


        this.load.bitmapFont('thickFont', 'thick_8x8.png', 'thick_8x8.xml');

    }
    create() {
        // Display controls using bitmap text
        this.add.bitmapText(150, 200, 'thickFont', 'Controls:', 32).setOrigin(0.5);
        this.add.image(125, 250, 'upArrow').setScale(4);
        this.add.image(125, 300, 'downArrow').setScale(4);
        this.add.image(75, 300, 'leftArrow').setScale(4);
        this.add.image(175, 300, 'rightArrow').setScale(4);
        this.add.bitmapText(125, 375, 'thickFont', 'To Move', 32).setOrigin(0.5);

    
        this.add.bitmapText(207, 500, 'thickFont', 'Shoot Heal Bullets: ', 24).setOrigin(0.5);
        this.add.image(380, 495, 'aKey').setScale(3);
    
        this.add.bitmapText(200, 550, 'thickFont', 'Shoot Kill Bullets: ', 24).setOrigin(0.5);
        this.add.image(370, 545, 'sKey').setScale(3);
    
        // Instructions to start the game
        this.add.bitmapText(320, 700, 'thickFont', 'Press Space to start', 32).setOrigin(0.5);

        this.add.bitmapText(350, 200, 'thickFont', 'Kill', 32).setOrigin(0.5);
        this.add.bitmapText(500, 200, 'thickFont', 'Heal', 32).setOrigin(0.5);
        this.add.image(350, 250, 'cubeMonsterFrame1').setScale(3);
        this.add.image(500, 250, 'infectedFrame1').setScale(3);
        this.add.image(350, 330, 'killBullet').setScale(3, 1.5);
        this.add.image(500, 330, 'healBullet').setScale(3, 1.5);
    
        // Listen for spacebar input
        this.input.keyboard.on('keydown-SPACE', this.startGame, this);
    }
        
    startGame() {
        // Transition to the main game scene
        this.scene.start('cityMap');
    }
}