// here engine is an object in which i have used the DOM API to create a canvas
//element, set its height and width and append it to the body of the document.
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
        //we get the 2d context from the canvas which will be used to draw on the
        //canvas and win is a global object

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

// here is a gameloop where i have used request animationframe that will be used to
// render the game 
//dt is difference btw last run game loop and present time
    function main() {

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }
// on the basis of dt, i.e time difference- the position of the enemies is updated

    function update(dt) {
   // check collision checks if the player collided with enemies or the boosters
   // and updates the score accordingly and removes the collided booster by splicing it

		function checkCollisions() {
			// here it checks if the player position is in the hitbox of the enemy.
            // I have used the new operator that creates object from constructor
            // if the booster is in the hitbox of the player sprite, it splices it till the game is reset again.
            
			for (var i = 0; i < allEnemies.length; i++) {
			
				if (player.pos[0] < allEnemies[i].pos[0] + allEnemies[i].hitbox[1]  && player.pos[0] + player.hitbox[1]  > allEnemies[i].pos[0] &&
					player.pos[1] < allEnemies[i].pos[1] + allEnemies[i].hitbox[0] && player.pos[1] + player.hitbox[0] > allEnemies[i].pos[1]) {
					
					for (var k = 0; k < allBoosters.length; k++) {
						allBoosters.splice(k, 3);
						k--;
					}
					
					player.pos = [215, 460];
					score = 0;
					allBoosters.push(new Booster(80, 240), new Booster(280, 350), new Booster(380, 170));
					ctx.canvas.width = ctx.canvas.width;
				}
			}
				
                // in this loop the score is updated by 20 points if the player
                //has colided with the booster		
			for (var j = 0; j < allBoosters.length; j++) {
			
				if (player.pos[0] < allBoosters[j].pos[0] + allBoosters[j].hitbox[1]  && player.pos[0] + player.hitbox[1]  > allBoosters[j].pos[0] &&
					player.pos[1] < allBoosters[j].pos[1] + allBoosters[j].hitbox[0] && player.pos[1] + player.hitbox[0] > allBoosters[j].pos[1]) {
					
					allBoosters.splice(j, 1);
					j--;
					score+= 20;
					ctx.canvas.width = ctx.canvas.width;
				}
			}
		}
		
		updateEntities(dt);		
        checkCollisions();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }
// render displays everything, sprites for background and enemy sprites, boosters
// and players according to the position set in their data structure
    function render() {

        var rowImages = [
                'images/water-block.png', 
                'images/stone-block.png', 
                'images/stone-block.png',  
                'images/stone-block.png',  
                'images/grass-block.png',   
                'images/grass-block.png'   
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    function renderEntities() {

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
		
		
		allBoosters.forEach(function(booster) {
			booster.render();
		});

        player.render();
    }

    function reset() {
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-princess-girl.png',
		'images/gem-orange.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
