

var allEnemies = []; 
var player;
var gem;
var allGems = []; 
var possibleGems = ['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png'];
var highestScore = 0;
var newHighScore; 
var score = 0;
var div = document.getElementById('score-board');
var audio = new Audio;


var Helper = function(){}

Helper.returnRandomValue = function(possibleValues){
    var randomStartingPosition = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomStartingPosition];
}

Helper.overlap = function(fig1, player){
    return !( player.x + fig1.xoffset > (fig1.x + fig1.width)  ||  // player is to the right of figure 1
            (player.x + player.width - fig1.xoffset) < fig1.x    ||  // player is to the left of fig 1
            player.y + (player.height - fig1.yoffset) < (fig1.y) ||  //player is above fig1
            player.y  > (fig1.y + (fig1.height - fig1.yoffset)))   //player is below fig1
}

 
Helper.sameBlock = function(fig1, player){
    var fig1Row = Helper.getRow(fig1);
    var fig1Col = Helper.getCol(fig1);
    var playerRow = Helper.getRow(player);
    var playerCol = Helper.getCol(player);
    if(fig1Row == playerRow && fig1Col == playerCol){
        return true;
    }
}


Helper.getRow = function(element){
    var row;
    if((element.y + element.height/2) <= 85){
        row = 0;
    }
    if((element.y + element.height/2) > 85 && (element.y + element.height/2) <= 170){
        row = 1;
    }
    if((element.y + element.height/2) > 170 && (element.y + element.height/2) <= 255){
        row = 2;
    }
    if((element.y + element.height/2) > 255 && (element.y + element.height/2) <= 340){
        row = 3;
    }
    if((element.y + element.height/2) > 340 && (element.y + element.height/2) <= 425){
        row = 4;
    }
    if((element.y + element.height/2) > 425){
        row = 5;
    }
    return row;
}


Helper.getCol = function(element) {
    var col;
    if(element.x < 100){
        col = 0;
    }
    if(element.x >= 100 && element.x < 200){
        col = 1;
    } 
    if(element.x >= 200 && element.x < 300){
        col = 2;
    }
    if(element.x >= 300 && element.x < 400){
        col = 3;
    }
    if(element.x >= 400){
        col = 4;
    }
    return col;
}


Helper.getGemScore = function(gemImageString){
    var gemScores = {
        "images/Gem-Green.png": 20,
        "images/Gem-Blue.png": 30,
        "images/Gem-Orange.png": 50
        }
    return gemScores[gemImageString];
}


Helper.updateScore = function(event){
    if(possibleGems.indexOf(event) > -1){ // if the event string is found in the array of possible gems
        score += Helper.getGemScore(event);
        div.innerHTML = "Gem! Score: " + score;
        audio.src = 'sounds/smw_power-up.wav';
        audio.play();
    }
    if(event == "died") {
        if(newHighScore){
            Helper.showHighScore();
        }
        newHighScore = false;
        score = 0;
        div.innerHTML = "Oh Snap, you died! Score: " + score;

        div.style.backgroundColor = "#FD589C";
        div.style.color = "#CFE13D";
        }

    if(event == "water"){
        score += 10;
        div.innerHTML = "Yay! Score: " + score;
        
    }
    
}


var Gem = function() {
    this.gemImage = Helper.returnRandomValue(possibleGems);
    this.x = Helper.returnRandomValue([126, 227, 328]);
    this.y = Helper.returnRandomValue([115, 200, 275]);
    this.width = 50;
    this.height = 85;   
}


Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gemImage), this.x, this.y);

}


Gem.prototype.update = function() {
    allGems.forEach(function(gem, index) {
        if(Helper.sameBlock(gem, player)){
            Helper.updateScore(gem.gemImage);
            Gem.expireGem(gem);
        }
    });
}



Gem.generateGem = function() {
    newGem = new Gem();
    allGems.push(newGem);
    audio.src = 'sounds/smw_power-up_appears.wav';
    audio.play();
    var delay = Helper.returnRandomValue([10000, 30000, 60000, 100000]); //
    setTimeout(function() { Gem.expireGem(newGem); }, 10000);
    setTimeout(Gem.generateGem, delay);
}


Gem.expireGem = function(expriringGem){
    allGems.forEach(function(gem, index) {
        if(expriringGem == gem ){
            allGems.splice(index, 1);
        }
    });
}


var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    if(score >= 100){
        this.y = Helper.returnRandomValue([60, 145, 230, 315]); // the y-axis coordinates of the paved tracks enemies can run on 
    } else {
        this.y = Helper.returnRandomValue([60, 145, 230]);
    }
    this.width = 171;
    this.height = 101;
    if(score >= 200){
        this.speed = Helper.returnRandomValue([250, 300, 350, 400, 500]); //
    } else {
        this.speed = Helper.returnRandomValue([200, 250, 280, 300, 320, 350, 400]);//
    }
    this.yoffset = 50;
    this.xoffset = 100;
    
}


Enemy.prototype.update = function(dt) {
    this.x += (this.speed) * dt;
    
    allEnemies.forEach(function(enemy, index) {
        if(Helper.overlap(enemy, player)){
            Helper.updateScore("died");
            player.y = 380;
        }
    });

}


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 

}


Enemy.generateEnemies = function() {
    allEnemies.push(new Enemy());
    Enemy.removeOffScreenEnemies();
    var delay;
    if(score >= 200){
        delay = Helper.returnRandomValue([0, 200, 500, 750]); 
     } else {
        delay = Helper.returnRandomValue([0, 500, 750, 1000]); 
     }
    setTimeout(Enemy.generateEnemies, delay);
}



Enemy.removeOffScreenEnemies = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 505){
            allEnemies.splice(index, 1);
        }
    });
}



var Player = function(){
    this.playerIcon = 'images/char-cat-girl.png';
    this.x = Helper.returnRandomValue([0, 100, 200, 300, 400]);
    this.y = 380;
    this.width = 171;
    this.height = 101;
}


Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
}


Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left'){
        if(this.x - 101 < 0){ 
            this.x = 0;  
        } else {
            this.x -= 100; // If it's on the grid, move left by 100
        }  
    } else if(keyCode == 'up'){ // water ranges from y=0 to y=85
        if(this.y - 85 < 0){ //prevents pressing up key at top of game from incrementing score   
            Helper.updateScore("water");  
            this.y =  380;   
        }
         else {
            this.y -= 85; 
        } 
    } else if(keyCode == 'right'){ 
         if(this.x + 101 > 400){  //Player's maximum rightward position
                this.x = 400; 
            } else {
                this.x += 100; 
            }
        } else if(keyCode == 'down') { 
            if(this.y + 85 > 380) {  //Players maximum distance from the top of the canvas
                this.y = 380; 
            } else {
                this.y += 85; 
            } 
        
    }
}

// Instantiate Objects
Enemy.generateEnemies();
player = new Player();

// Randomly generate gems
Gem.generateGem();


 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});



