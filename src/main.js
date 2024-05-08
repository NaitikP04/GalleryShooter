// Phaser: 3.70.0
// 

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60 },
    width: 640,
    height: 800,
    scene: [StartScene, CityMap, BossMap, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
}

// Global variable to hold sprites
var my = {sprite: {}};

// high score
let highScore = 0;

const game = new Phaser.Game(config);
