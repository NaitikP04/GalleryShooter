class BossMap extends Phaser.Scene {
    constructor() {
        super("bossMap");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Final Boss Level!</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        
        my.sprite.leftarm = this.add.sprite(this.bodyX+90, this.bodyY+40, "monsterParts", "arm_darkE.png");
        my.sprite.leftarm.angle = -25;

        my.sprite.rightarm = this.add.sprite(this.bodyX-95, this.bodyY+40, "monsterParts", "arm_darkE.png");
        my.sprite.rightarm.angle = 25;
        my.sprite.rightarm.flipX = true;

        my.sprite.leftleg = this.add.sprite(this.bodyX-50, this.bodyY+100, "monsterParts", "leg_whiteE.png");
        my.sprite.leftleg.flipX = true;
        my.sprite.rightleg = this.add.sprite(this.bodyX+50, this.bodyY+100, "monsterParts", "leg_whiteE.png");

        //add red horn
        my.sprite.horn = this.add.sprite(this.bodyX+50, this.bodyY-90, "monsterParts", "detail_red_horn_large.png");

        //add dark antenna
        my.sprite.antenna = this.add.sprite(this.bodyX-10, this.bodyY-130, "monsterParts", "detail_yellow_antenna_large.png");
        my.sprite.antenna.flipX = true;

        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_darkF.png");
        my.sprite.lefteye = this.add.sprite(this.bodyX-35, this.bodyY-20, "monsterParts", "eye_psycho_dark.png");
        my.sprite.lefteye.setScale(0.7);
        my.sprite.righteye = this.add.sprite(this.bodyX+35, this.bodyY-20, "monsterParts", "eye_psycho_light.png");
        my.sprite.righteye.setScale(0.8);

        my.sprite.smile = this.add.sprite(this.bodyX, this.bodyY + 40, "monsterParts", "mouthH.png");
        my.sprite.smile.visible = true;
        my.sprite.fangs = this.add.sprite(this.bodyX, this.bodyY + 40, "monsterParts", "mouthB.png");
        my.sprite.fangs.visible = false;

        this.input.keyboard.on("keydown", function(event) {
            console.log(event.code);
            if (event.code === "KeyS") {
                my.sprite.smile.visible = true;
                my.sprite.fangs.visible = false;
            }
        });

        this.input.keyboard.on("keydown", function(event) {
            console.log(event.code);
            if (event.code === "KeyF") {
                my.sprite.smile.visible = false;
                my.sprite.fangs.visible = true;
            }
        });

        super.create();

    }
    

    update() {
        let my = this.my;    // create an alias to this.my for readability   

        if (this.input.keyboard.addKey('A').isDown) {
            for (let part in my.sprite) {
                my.sprite[part].x -= 2;  
            }
        } else if (this.input.keyboard.addKey('D').isDown) {
            for (let part in my.sprite) {
                my.sprite[part].x += 2;  
            }
        }
    }
}

