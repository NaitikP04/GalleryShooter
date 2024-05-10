class Path extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;
    runmode;
    runmode = false;
    
    constructor(){
        super("pathMaker");
    }

    preload() {
        this.load.setPath("./assets/");                        // Set load path
        this.load.image("x-mark", "numeralX.png");             // x marks the spot
        this.load.image("enemyShip", "enemyGreen1.png");       // spaceship that runs along the path
    }

    create() {
        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.points = [
            20, 20,
            80, 400,
            300, 750
        ];
        this.curve = new Phaser.Curves.Spline(this.points); //creation of the spline curve 

        // Initialize Phaser graphics, used to draw lines
        this.graphics = this.add.graphics();

        // Define key bindings
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.oKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // Draw initial graphics
        this.xImages = [];
        this.drawPoints();
        this.drawLine();

        // Create mouse event handler
        // We create this in create() since we only want one active in this scene
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            this.addPoint({x: pointer.x, y: pointer.y});
            this.drawLine();
        });

        // TODO:
        //  - set the run mode flag to false (after implenting run mode)

        // Create enemyShip as a follower type of sprite
        // Call startFollow() on enemyShip to have it follow the curve
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.enemyShip.visible = false;

        document.getElementById('description').innerHTML = '<h2>Path.js</h2><br>ESC: Clear points <br>O - output points <br>R - run mode';
    }

    // Draws an x mark at every point along the spline.
    drawPoints() {
        for (let point of this.curve.points) {
            this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
        }
    }

    // Clear points
    // Removes all of the points, and then clears the line and x-marks
    clearPoints() {
        this.curve.points = [];
        this.graphics.clear();
        for (let img of this.xImages) {
            img.destroy();
        }
    }

    // Add a point to the spline
    addPoint(point) {
        this.curve.addPoint(point);
        this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
    }

    // Draws the spline
    drawLine() {
        this.graphics.clear();                      // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
        this.curve.draw(this.graphics, 32);         // Draw the spline
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.ESCKey)) {
            console.log("Clear path");
            // TODO: 
            // * Add code to check if run mode is active
            //   If run mode is active, then don't call clearPoints()
            //   (i.e., can only clear points when not in run mode)
            if (this.runmode == false){
                this.clearPoints();
            }
            else {
                console.log("Cannot clear points in run mode");
            }
        }



        if (Phaser.Input.Keyboard.JustDown(this.oKey)) {
            console.log("Output the points");

            // TODO:
            // * Print out the points comprising the line
            //   use a "for ... of" loop to iterate through the
            //   elements of this.curve.points 
            //
            // Format them in the form of an array, so you can copy/paste into
            // your gallery shooter game:
            // [
            //  point0.x, point0.y,
            //  point1.x, point1.y
            // ]

            console.log("[");
            for (let point of this.curve.points) {
                console.log(point.x + ", " + point.y + "\n");
            }
            console.log("]");
        }   

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            console.log("Run mode");
            //
            // TODO: 
            // Implement run mode
            // Check for runMode active
            //   If active:
            //   - call stopFollow on the enemyShip to halt following behavior
            //   - make the enemyShip sprite invisible
            //   - set run mode to false
            //  If not active:
            //   - set run mode to true
            //   - set the location of enemyship to the first point on the curve
            //     (get this from the zero'th element of this.curve.points array,
            //      e.g., this.curve.points[0].x)
            //     (sprites like enemyShip have .x and .y properties)
            //     Be careful! What happens if this.curve.points is empty?? Perhaps
            //     you should check for this condition...
            //   - make the enemyShip sprite visible
            //   - call startFollow on enemyShip with the following configuration
            //     object:
            // {
            //     from: 0,
            //     to: 1,
            //     delay: 0,
            //     duration: 2000,
            //     ease: 'Sine.easeInOut',
            //     repeat: -1,
            //     yoyo: true,
            //     rotateToPath: true,
            //     rotationOffset: -90
            // }
            if (this.runmode == true) {
                my.sprite.enemyShip.stopFollow();
                my.sprite.enemyShip.visible = false;
                this.runmode = false;
            } 
            else if (this.runmode == false) {
                this.runmode = true;
                if (this.curve.points.length > 0) {
                    my.sprite.enemyShip.x = this.curve.points[0].x;
                    my.sprite.enemyShip.y = this.curve.points[0].y;
                    my.sprite.enemyShip.visible = true;
                    my.sprite.enemyShip.startFollow({
                        from: 0,
                        to: 1,
                        delay: 0,
                        duration: 2000,
                        ease: 'Sine.easeInOut',
                        repeat: -1,
                        yoyo: true,
                        rotateToPath: true,
                        rotationOffset: -90
                    });
                }
                else {
                    console.log("No points on the curve"); //error message in case curve is empty
                }
            }
        }

    }

}