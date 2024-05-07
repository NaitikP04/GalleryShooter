let enemies;
let infected;

class CityMap extends Phaser.Scene {
        
    constructor() {
        super("cityMap");
        this.waveConfig = [
            {enemyCount: 5, infectedCount: 5, spawnInterval: 1500},
            {enemyCount: 10, infectedCount: 15, spawnInterval: 1500},
            {enemyCount: 20, infectedCount: 20, spawnInterval: 1500},
        ];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("city-map-tiles", "tilemap_packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "CityMap.json");          // Load JSON of tilemap

        this.load.image("x-mark", "numeralX.png"); 

        this.load.image("enemyBullet", "laserBlue.png");
        this.load.image("explosion", "laserExplosion.png");

        this.load.image("hpEmpty", "heartEmpty.png");
        this.load.image("hpHalf", "heartHalf.png");
        this.load.image("hpFull", "heartFull.png");


        // Set path for audio files
        this.load.setPath('./assets/Audio/');

        // Load audio files
        this.load.audio('zombieKill', 'zombieKill.ogg');
        this.load.audio('zombieImpactPlayer', 'zombieImpactPlayer.ogg');
        this.load.audio('zombieHeal', 'zombieHeal.ogg');
        this.load.audio('monsterKill', 'monsterKill.ogg');
        this.load.audio('monsterHpUp', 'monsterHpUp.ogg');
        this.load.audio('monsterHpDown', 'monsterHpDown.ogg');
        this.load.audio('killBulletSound', 'killBulletSound.ogg');
        this.load.audio('healBulletSound', 'healBulletSound.ogg');
        this.load.audio('playerDeath', 'playerDie.ogg');
        this.load.audio('playerHit', 'playerHitBullet.ogg');
    }

    create() {

        this.currentWave = 0;

        // Add a tile map
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#tilemap__anchor
        // "map" refers to the key from load.tilemapTiledJSON
        // The map uses 16x16 pixel tiles, and is 10x10 tiles large
        this.map = this.add.tilemap("map", 16, 16, 10, 10);

        // Add a tileset to the map
        // First parameter: the name we gave to the tileset when it was added to Tiled
        // Second parameter: the key for the tilesheet (from this.load.image above)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        this.tileset = this.map.addTilesetImage("city-map-tiled", "city-map-tiles");

        // Create a tile map layer
        // First parameter: name of the layer from Tiled
        // https://newdocs.phaser.io/docs/3.54.0/Phaser.Tilemaps.Tilemap#createLayer
        this.baseLayer = this.map.createLayer("base-layer", this.tileset, 0, 0);
        this.roadLayer = this.map.createLayer("roads-and-buildings", this.tileset, 0, 0);
        this.objectLayer = this.map.createLayer("object-layer", this.tileset, 0, 0);
        this.collisionLayer = this.map.createLayer("collision-layer", this.tileset, 0, 0);
        this.collisionLayer.visible = false;

        this.player = this.physics.add.sprite(320, 730, "player");
        this.player.setScale(2.5);
        this.playerHP = 10;

        this.bulletsA = this.physics.add.group();
        this.bulletsB = this.physics.add.group();

        this.enemyBullets = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.physics.add.collider(this.player, this.objectLayer);
        this.objectLayer.setCollisionBetween(39, 250);

        this.physics.add.collider(this.player, this.collisionLayer);
        this.collisionLayer.setCollisionBetween(307, 310);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.player.setCollideWorldBounds(true);

        this.score = 0;
        this.scoreText = this.add.bitmapText(130, 30, 'thickFont', 'Score: ' + this.score, 32).setOrigin(0.5);

        this.highScore = localStorage.getItem('highScore') || 0;
        this.highScoreText = this.add.bitmapText(550, 30, 'thickFont', 'HS: ' + this.highScore, 32).setOrigin(0.5);

        enemies = this.physics.add.group({collideWorldBounds: false});
        infected = this.physics.add.group({collideWorldBounds: false});

        this.anims.create({
            key: 'monsterAnimation', // Unique key for the animation
            frames: [
                { key: 'cubeMonsterFrame1' }, // First frame
                { key: 'cubeMonsterFrame2' }  // Second frame
            ],
            frameRate: 5, // Number of frames per second
            repeat: -1 // Repeat indefinitely
        });

        this.anims.create({
            key: 'infectedAnimation', // Unique key for the animation
            frames: [
                { key: 'infectedFrame1' }, // First frame
                { key: 'infectedFrame2' }  // Second frame
            ],
            frameRate: 5, // Number of frames per second
            repeat: -1 // Repeat indefinitely
        });

        // this.spawnEnemy();
        // this.spawnInfected();

        this.startSpawning();

        this.hearts = this.add.group();

        this.createHearts(this.playerHP);


        document.getElementById('description').innerHTML = '<h2>Welcome to CityMap</h2>'

    }    

    shoothealBullet() {
        const bullet = this.bulletsA.create(this.player.x, this.player.y, 'healBullet');
        this.sound.play('healBulletSound');
        bullet.setScale(1,0.5);
        bullet.setVelocityY(-400); // Moves upward
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', () => {
            bullet.destroy();
        });
    }

    shootkillBullet() {
        const bullet = this.bulletsB.create(this.player.x, this.player.y, 'killBullet');
        this.sound.play('killBulletSound');
        bullet.setScale(1,0.5);
        bullet.setVelocityY(-400); // Moves upward
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', () => {
            bullet.destroy();
        });
    }

    bulletHitEnemy(bullet, enemy) {
        if (bullet.texture.key === 'healBullet') {
            // Heal the enemy
            enemy.hp += 1;
            this.sound.play('monsterHpUp', {volume: 0.6});
            //make enemy bigger and faster
            enemy.setScale(enemy.scaleX + 0.2, enemy.scaleY + 0.2);
            enemy.body.velocity.y *= 1.05;
        }
        if (bullet.texture.key === 'killBullet') {
            // Damage the enemy
            enemy.hp -= 1;
            this.sound.play('monsterHpDown', {volume: 0.6});

            if (enemy.hp > 0) {
                enemy.setScale(enemy.scaleX - 0.2, enemy.scaleY - 0.2);
                enemy.body.velocity.y /= 1.05;
            }
        }
        if (enemy.hp <= 0) {
            console.log('Enemy destroyed');
            this.sound.play('monsterKill');
            this.score += 10;
            this.spawnExplosion(enemy.x, enemy.y);
            enemy.destroy();
        }
        bullet.destroy();
    }
    
    bulletHitInfected(bullet, zombie) {
        if (bullet.texture.key === 'healBullet') {
            // Heal the zombie
            zombie.hp += 1;
        }
        if (bullet.texture.key === 'killBullet') {
            // Damage the zombie
            zombie.hp -= 1;
        }
    
        if (zombie.hp > 0) {
            console.log('Zombie Healed');
            this.sound.play('zombieHeal');
            this.score += 10;    
            this.tweens.add({
                targets: zombie,
                y: zombie.y - 200, // Float up by adjusting the y position
                alpha: 0, // Fade out
                duration: 1500, // Duration of the tween
                onComplete: () => {
                    // Destroy the zombie after the tween completes
                    zombie.destroy();
                }
            });
        }
        if (zombie.hp < 0) {
            console.log('Zombie killed');
            this.sound.play('zombieKill');
            this.spawnExplosion(zombie.x, zombie.y);
            this.score -= 10;
            zombie.destroy();
        }
        
        bullet.destroy();
    }  

    bulletHitPlayer(player, bullet) {
        bullet.destroy();
        this.playerHP -= 1;
        this.sound.play('playerHit');
        if (this.playerHP <= 0) {
            this.sound.play('playerDeath');
            this.scene.start('gameOver');
        }
    }

    startSpawning(){
        if (this.currentWave < this.waveConfig.length) {
            const wave = this.waveConfig[this.currentWave];
            const totalInfected = wave.infectedCount;
            const totalMonster = wave.enemyCount;
            let spawnedInfected = 0;
            let spawnedMonster = 0;

            this.spawnTimer = this.time.addEvent({
                delay: wave.spawnInterval,
                callback: () => {
                    if (spawnedInfected < totalInfected || spawnedMonster < totalMonster) {
                        this.spawnInfected();
                        this.spawnEnemy();
                        spawnedInfected++;
                        spawnedMonster++;
                    } else {
                        this.currentWave++;
                        this.spawnTimer.remove();
                        this.time.addEvent({
                            delay: 15000,
                            callback: this.startSpawning,
                            callbackScope: this
                        });
                    }
                },
                loop: true
            });
        }
        // after all waves are done, end the game go to next scene after 15 seconds
        else {
            this.time.addEvent({
                delay: 30000,
                callback: () => {
                    this.scene.start('gameOver');
                }
            });
        }
  
    }

    spawnEnemy(){
        const bounds = this.physics.world.bounds;
        // console.log(bounds);
        // console.log(posX);

        //spawn 2 enemies at a time (x axis)
        for (let i = 0; i < 2; i++) {
            const posX = Phaser.Math.Between(bounds.x + 150, bounds.x + bounds.width -140);
            const enemy = this.physics.add.sprite(posX, bounds.y-32, 'cubeMonsterFrame1');
            enemy.setScale(1.5);
            enemy.hp = 1;

            enemies.add(enemy);

            enemy.body.velocity.y = 30;
            enemy.body.velocity.x = -60;
        
            // Play the animation
            enemy.play('monsterAnimation');
            const tween = this.tweens.add({
                targets: enemy.body.velocity,
                x: 60,
                duration: 3000,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                onUpdate: () => {
                    if (enemy && enemy.hp > 0) {
                        if (enemy.body.velocity.x) {
                            enemy.setFlipX(true); // Flip sprite if moving right
                        } else {
                            enemy.setFlipX(false); // Reset sprite to normal if moving left
                        }
                    } else{
                        // Add any additional actions you want to perform when the enemy dies
                        // For example, stop the tween and destroy the enemy sprite
                        enemy.tween.stop();
                        enemy.destroy();
                    }

                }               
            });
            enemy.tween = tween;

            this.fireEnemyBullet(enemy);

            // Create a timer event to fire bullets periodically
            const bulletTimer = this.time.addEvent({
                delay: 4000, // Fire every 4 seconds (adjust as needed)
                callback: () => {
                    this.fireEnemyBullet(enemy);
                },
                loop: true // Repeat indefinitely
            });
        }

        // this.time.addEvent({
        //     callback: () => this.spawnEnemy(),
        //     delay: 1000
        // })
    }

    fireEnemyBullet(enemy) {
        if (enemy.hp > 0) {
            // Create bullet sprite at the position of the enemy
            const bullet = this.enemyBullets.create(enemy.x, enemy.y, 'enemyBullet');
            bullet.setScale(1, 0.3);
            bullet.flipY = true; // Flip the bullet sprite
            // Set bullet velocity and direction
            bullet.setVelocity(0, 200);
            // Set collision behavior if needed
        }
    }

    spawnExplosion(x, y) {
        // Spawn explosion sprite
        const explosion = this.add.sprite(x, y, 'explosion');
        explosion.setScale(0.5); // Adjust scale as needed
        
        // Add fade-out animation
        this.tweens.add({
            targets: explosion,
            alpha: 0,
            duration: 500, // Adjust duration as needed
            onComplete: () => {
                explosion.destroy(); // Destroy explosion sprite after animation
            }
        });
    }

    spawnInfected(){
        const bounds = this.physics.world.bounds;

        const posY = Phaser.Math.Between(bounds.y , bounds.y + bounds.height - 500);

        // Determine the side to spawn the enemy (left or right)
        const side = Math.random() < 0.5 ? 'left' : 'right';
        let posX;
        if (side === 'left') {
            posX = bounds.x + 32; // Adjust this value based on your preference
        } else {
            posX = bounds.x + bounds.width - 32; // Adjust this value based on your preference
        }

        // Create the enemy sprite
        const zombie = this.physics.add.sprite(posX, posY, 'infectedFrame1');
        zombie.hp = 0;
        infected.add(zombie);

        zombie.body.velocity.x = (side === 'left') ? 10 : -10;

        zombie.play('infectedAnimation');
        
        // Store the player's position for later use
        let playerX = this.player.x;
        let playerY = this.player.y;

        // Set the offset for the tween
        const offset = Math.random() * 101;

        const tween = this.tweens.add({
            targets: zombie,
            x: (side === 'left') ? bounds.centerX + offset : bounds.centerX - offset,
            ease: 'Bounce.easeInOut',
            duration: 3000,
            onComplete: () => {
                playerX = this.player.x;
                playerY = this.player.y;
                // this.infectedMiddleBehavior();
            }
        });
        zombie.tween = tween;

        // this.time.addEvent({
        //     callback: () => this.spawnInfected(),
        //     delay: 4000
        // });
    }

    infectedMiddleBehavior(){

        const playerX = this.player.x;
        const playerY = this.player.y;

        infected.getChildren().forEach(zombie => {
            const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, playerX, playerY);
            const speed = 30;

            var zomBoundleft = zombie.x - 10;
            var zomBoundright = zombie.x + 10;

            //bias the bounds based on the player position
            const diff = playerX - zombie.x;
            // console.log(diff);
            if (diff > 0) {
                zomBoundleft += 20;
                zomBoundright += diff+ 20;
            }
            else if (diff < 0){
                zomBoundright -= 20;
                zomBoundleft -= (diff+20);
            }
            let time = this.time.now;
            // zombie.body.velocity.x = Math.cos(angle) * speed;
            // every 2 seconds, change direction
            if (time % 2000 < 1000) {
                if (zomBoundleft > zomBoundright) {
                    zombie.body.velocity.x = speed * -2;
                }
                else if (zomBoundleft < zomBoundright) {
                    zombie.body.velocity.x = speed * 2;
                }
            }
            else {
                if (zomBoundleft > zomBoundright) {
                    zombie.body.velocity.x = speed;
                }
                else if (zomBoundleft < zomBoundright) {
                    zombie.body.velocity.x = speed * -1;
                }
            }
            zombie.body.velocity.y = speed;


            // flip sprite based on velocity
            if (zombie.body.velocity.x < 0) {
                zombie.setFlipX(false);
            } else {
                zombie.setFlipX(true);
            }   
        });
    }

    infectedHitPlayer(player, zombie) {
        zombie.destroy();
        this.playerHP -= 1;
        this.sound.play('zombieImpactPlayer');
        if (this.playerHP <= 0) {
            this.sound.play('playerDeath');
            this.scene.start('gameOver');
        }
    }

    createHearts() {
        // Clear existing hearts
        this.hearts.clear(true);
    
        // Calculate the number of full hearts
        const fullHearts = Math.floor(this.playerHP / 2);
    
        // Calculate the number of half hearts
        const halfHearts = this.playerHP % 2;
    
        // Calculate the number of empty hearts
        const emptyHearts = Math.floor((10 - this.playerHP) / 2);
    
        // Add full hearts
        for (let i = 0; i < fullHearts; i++) {
            const heart = this.add.image(450 + i * 40, 770, 'hpFull');
            heart.setScale(2.5);
            heart.setAlpha(0.8);
            this.hearts.add(heart);
        }
    
        // Add half hearts
        for (let i = 0; i < halfHearts; i++) {
            const heart = this.add.image(450 + (fullHearts + i) * 40, 770, 'hpHalf');
            heart.setScale(2.5);
            heart.setAlpha(0.8);

            this.hearts.add(heart);
        }
    
        // Add empty hearts
        for (let i = 0; i < emptyHearts; i++) {
            const heart = this.add.image(450 + (fullHearts + halfHearts + i) * 40, 770, 'hpEmpty');
            heart.setScale(2.5);
            heart.setAlpha(0.8);
            this.hearts.add(heart);
        }
    }

    updateHighScore() {
        // Update high score if current score is higher
        if (this.score > this.highScore) {
            this.highScore = this.score;
            // Store new high score in local storage
            localStorage.setItem('highScore', this.highScore);
        }
        // Set current score and high score in game registry for access in game over scene
        this.registry.set('currentScore', this.score);
        this.registry.set('highScore', this.highScore);
    }

    update() {
        this.player.setVelocityY(0);
        this.player.setVelocityX(0);
        if (this.cursors.up.isDown==true) {
            this.player.setVelocityY(-190);
        }
        if (this.cursors.down.isDown==true) {
            this.player.setVelocityY(190);
        }
        if (this.cursors.right.isDown==true) {
            this.player.setVelocityX(190);
            this.player.flipX = false;
        }
        if (this.cursors.left.isDown==true) {
            this.player.setVelocityX(-190);
            this.player.flipX = true;
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.shoothealBullet();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.shootkillBullet();
        }

        this.infectedMiddleBehavior();

        this.physics.overlap(this.bulletsA, enemies, this.bulletHitEnemy, null, this);
        this.physics.overlap(this.bulletsB, enemies, this.bulletHitEnemy, null, this);

        this.physics.overlap(this.bulletsA, infected, this.bulletHitInfected, null, this);
        this.physics.overlap(this.bulletsB, infected, this.bulletHitInfected, null, this);

        this.physics.overlap(this.enemyBullets, this.player, this.bulletHitPlayer, null, this);

        this.physics.overlap(this.player, infected, this.infectedHitPlayer, null, this);
        
        this.scoreText.setText("Score: " + this.score);

        if (this.playerHP <= 0) {
            // Update high score
            this.updateHighScore();
            // Transition to game over scene
            this.scene.start('gameOver');
        }

        this.createHearts(this.playerHP);
        
    }
}