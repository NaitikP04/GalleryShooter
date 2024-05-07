class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        // Display game over text
        this.add.bitmapText(320, 200, 'thickFont', 'Game Over', 64).setOrigin(0.5);

        // Display current score
        this.add.bitmapText(320, 300, 'thickFont', 'Score: ' + this.registry.get('currentScore'), 32).setOrigin(0.5);

        // Display high score
        this.add.bitmapText(320, 350, 'thickFont', 'High Score: ' + this.registry.get('highScore'), 32).setOrigin(0.5);

        // Display restart option
        const restartText = this.add.bitmapText(320, 450, 'thickFont', 'Press SPACE to Restart', 32).setOrigin(0.5);

        // Listen for space key to restart the game
        this.input.keyboard.on('keydown-SPACE', () => {
            // Restart the game scene
            this.scene.start('cityMap');
        });
    }
}
