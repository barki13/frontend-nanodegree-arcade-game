// enemy object- all objects inherit from other objects except undefined.
// we have used total 6 sprites in the game
// update function changes the position stored within enemy. 
// 1. updates 2. renders
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
	this.pos = [x, y];
	this.hitbox = [50, 77];
	this.speed = speed;
};
 
Enemy.prototype.update = function(dt) {
	this.pos[0] = this.pos[0] + this.speed * dt;	
	if (this.pos[0] > ctx.canvas.width) {
		this.pos[0] = -100;
	}
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
};
 
var Player = function(x, y) {
	this.sprite = 'images/char-princess-girl.png';
	this.pos = [x, y];
	this.size = [171, 101];
	this.hitbox = [50, 60];
};
 
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
	ctx.font = "500 40px arial";
	ctx.fillText("Score: " + score, 0, 50);
};
 
Player.prototype.update = function(dt) {
	if (this.pos[1] <= 40) {
		this.pos = [200, 430];
		score+=10;
		ctx.canvas.width = ctx.canvas.width;
	}

	if (this.pos[0] < 0) {
		this.pos[0] = 0;
	}	
	
	else if (this.pos[0] > ctx.canvas.width -  this.size[1]) {
		this.pos[0] = ctx.canvas.width - this.size[1];
	}

	if (this.pos[1] < 0) {
		this.pos[1] = 0; 
	}

	else if (this.pos[1] > ctx.canvas.height - this.size[0]) {
		this.pos[1] = ctx.canvas.height - this.size[0];
	}
};

Player.prototype.handleInput = function(keys) {
	switch(keys) {
		case 'left' :
			this.pos[0] = this.pos[0] - 50;
			break;
			
		case 'right' :
			this.pos[0] = this.pos[0] + 50;
			break;
			
		case 'down' :
			this.pos[1] = this.pos[1] + 50;
			break;
			
		case 'up' :
			this.pos[1] = this.pos[1] - 50;
			break;
	}
};
	
var Booster = function(x, y) {
	this.sprite = 'images/gem-orange.png';
	this.pos = [x, y];
	this.hitbox = [30, 70];
};

Booster.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
};

var allBoosters = [new Booster(80, 240), new Booster(280, 350), new Booster(380, 170)];
var allEnemies = [new Enemy(-100, 300, 250), new Enemy(-300, 380, 150), new Enemy(-500, 220, 350), new Enemy(-700, 130, 420)];
var player = new Player(215, 460);

var score = 0;

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
 
    player.handleInput(allowedKeys[e.keyCode]);
});