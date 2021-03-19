/**
 * Things to do... make way to get back to main menu once game over --- done
 *  Give option to continue to next level or main menu when beating --- done
 * level..level is beat when all invaders are at zero. --- done
 * add in health function/bar.. end game when health reaches zero. --- done
 *  
 * Create another level... load levels based on previously beaten level.
 */
 const screen = document.getElementById("canvas").getContext("2d");
 const screenWidth = screen.canvas.clientWidth;
 const screenHeight = screen.canvas.clientHeight;
 const healthBuffer = document.createElement("canvas").getContext("2d");
 healthBuffer.width = 100;
 healthBuffer.height = 50;
 /***********
  * 
  * Helper functions
  * 
  ***********/
 function drawObj(screen, obj){
     screen.fillStyle = obj.color;
     screen.fillRect(obj.x, obj.y, obj.width, obj.height);
 }
 
 function getSide(obj){
     return {
         top: obj.y,
         bottom: obj.y + obj.height,
         left: obj.x,
         right: obj.x + obj.width,
     }
 }
 
 function isColliding(obj, target){
     if((getSide(obj).bottom > target.y)
         &&(obj.y < getSide(target).bottom)
         && (getSide(obj).right > target.x)
         && (obj.x < getSide(target).right)){
         return true;
     }
     return false;
 }
 
 function drawText(text, font, fillStyle, x, y, ctx, alignCenter = false, bgColor, width, height){
     ctx.fillStyle = bgColor;
     ctx.fillRect(0,0, width, height);
     ctx.font = font;
     ctx.fillStyle = fillStyle;
     
     if(alignCenter){
         ctx.textAlign ="center";
     }else{
         ctx.textAlign = "start";
         ctx.textBaseline = "top";
     }
     ctx.fillText(text, x ,y);
 }   
 
 //================================= Keyboard Listener =======================//
 const keyListener = {
     left: false,
     right: false,
     fire: false,
     fired: {},
     controller: function(event, game){
         
         let keyIsDown = (event.type === "keydown") ? true : false;
     
         switch(event.keyCode){
             case 37:
                 this.left = keyIsDown;
                 break;
             case 39:
                 this.right = keyIsDown;  
                 break;
             case 32:
                 if(this.fired[event.keyCode]){
                     //////console.log("fired already");
                     return;
                 }
                 //this.fire = keyIsDown;
                 game.player.fireBullet(game);
                 this.fired[event.keyCode] = true;
                 //////console.log("returned");
                 break;
         }
        // this.lastFired = Date.now();
     },
     gameStatus: function(event, game){
         switch(event.keyCode){
             case 13: //ENTER key pressed
                 //console.log("Enter key pressed start game");
                 if(game.gameState !== "RUNNING" && game.gameState !== "PAUSED"){
                     //console.log("calling game init..this is the game status: ", game.gameState);
                    // tick(0);
                     game.init();
                     
                 }
                 break;
             case 27: //ESC key pressed
                 game.pause();
                 break;
             case 78: //N key pressed
                 //////console.log("Kill game and go to main menu");
                // game.started = false;
                if(game.gameState == "LEVELWON"){
                     game.gameState = "GAMEOVER";
                     game.menu();
                 }
                 break;
             case 89:// Y key pressed
                 if(game.gameState === "LEVELWON"){
                     ////console.log("proceed to next level!!");
                     game.level = 2;
                     game.init();
                  }
                 break;
         }
     },
     initkeyListener: function(game) {
         window.addEventListener("keydown", event =>{
            event.preventDefault();
            this.controller(event, game);
            this.gameStatus(event, game);
         });
         window.addEventListener("keyup", event =>{
            // ////console.log("Key up triggered.");
             delete this.fired[event.keyCode];
             this.controller(event, game);
        
         });
     }
 }
 /****************
  * 
  * Game Objects
  * Bullet
  * Player
  * Invader
  * 
 *******************/
 
 function Bullet(position, vel, firedFrom = null, color = "white", width = 5, height = 5){
 
     this.color = color;
     this.width = width;
     this.height = height;
     this.x = position.x;
     this.y = position.y;
     this.vel = vel;
     this.firedFrom = firedFrom;
 }
 
 Bullet.prototype = {
     update(delta, game){
         this.y -= this.vel * delta;
         if(this.y < 0 || this.y > game.height){
             this.toRemove = true;
         }
         game.invaders.forEach(invader =>{
             if(isColliding(this, invader) && this.firedFrom !== "invader"){
                 //////console.log("Bullet hit invader");
                 invader.toRemove = true;
                 this.toRemove = true;
                // ////console.log("The length of invaders array: ", game.invaders.length);
             }
         });
             if(isColliding(this, game.player) && this.firedFrom === "invader"){
                 this.toRemove = true;
                 //////console.log("Bullet hit player");
                 game.player.updHealth(0);
             }
     },
     draw(screen){
         drawObj(screen, this);
     }
 }
 
 function Player(position, size){
     this.width = size.width;
     this.height = size.height;
     this.x = position.x;
     this.y = position.y;
     this.vel = 300;
     this.color = "white";
     this.health = 100;
     this.healthDec = 10;
     this.healthInc = 5;
     this.lastFired = 5;
 }
 
 Player.prototype = {
     update(delta, game){
         if(getSide(this).left < 0){
            // ////console.log("player off left of screen");
            this.x = screenWidth - this.width;
         }else if(getSide(this).right > screenWidth){
            // ////console.log("player off right of screen");
            this.x = 0;
         }
          if(keyListener.left){
            // ////console.log("move left");
             this.x -= this.vel * delta;
            // ////console.log("player x position: ", this.x);
         }else if(keyListener.right){
             //////console.log("move right");
             this.x += this.vel * delta;
         }
     },
     fireBullet(game){
         game.addGameObject(new Bullet({x: this.x + this.width  / 2, y: this.y}, 200));
     },
     draw(screen){
         drawObj(screen, this);
         screen.drawImage(healthBuffer.canvas, 10, 5);
     },
     drawHealth(){
         //////console.log("should be drawing health");
         healthBuffer.clearRect(0, 0, healthBuffer.width, healthBuffer.height);
         drawText(`Health ${this.health}`, "16px Arial", "white", 0, 0, healthBuffer, false);
     },
     updHealth(incOrDec){
       //  ////console.log("Initial health: ", this.health);
             switch(incOrDec){
                 case 0: 
                     if(this.health == 10){
                         game.gameState = "GAMEOVER";
                     }else{
                         this.health -= this.healthDec;
                         //////console.log("Health: ", this.health);
                     }
                     break;
                 case 1:
                     this.health += this.healthInc;
                     //////console.log("Health: ", this.health);
                     break;
             }
             //////console.log("should be drawing new health");
             this.drawHealth();
     }
 
 }
 
 function generateInvaders(game, level){
     const levels = {
         one: 
         [
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 
         ],
 
         two: 
         [ 
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,  
             1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
         ],
     }
     let columns = 16;
     let invaderSize = 25;
     let invaders = [];
     let invaderMap;
     switch(level){
         case 1:
             invaderMap = levels.one;
             break;
         case 2: 
             invaderMap = levels.two;
     }
    /* let invaderMap = 
     [   1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
         1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
         1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
         1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
     ];*/
     invaderMap.forEach((item, index) => {
          if(item != 0){
             let x = (index % columns) * invaderSize + 20;
             let y = (Math.floor(index/columns) ) * invaderSize + 30;
             invaders.push(
                 new Invader({x: x, y: y}, game)
                 );
             } 
     });
     return invaders;
 }
 
 function Invader(position){
     this.width = 20;
     this.height = 20;
     this.x = position.x;
     this.y = position.y;
     this.hTravel = 0;
     this.vel = 100;
     this.color = "orange";
    // ////console.log("inside invader constuctor function");
   
 }
 Invader.prototype = {
     update(delta, game){
         //////console.log("delta value is: ", delta);
         if(this.hTravel < 0 || this.hTravel > 220){
             this.vel = -this.vel;
         }
         this.x += this.vel * delta;
         this.hTravel += this.vel * delta;
        //setTimeout(  ,3000);
         if(Math.random() > 0.997){
             this.fire(game);
         }
     },
     draw(screen){
         drawObj(screen, this);
     },
     fire(game){
         game.addGameObject(new Bullet({x: this.x + this.width / 2, y: this.y + this.height}, -100, "invader","red", 7, 9));
     }
 }
 /*******
  * 
 //======================================== Game Object ==============================================//
  * 
 ********/
 
 function Game(width, height){
     this.width = width;
     this.height = height;
     this.player = new Player({x: this.width/2 - 20, y: this.height - 20},{width: 40, height: 10});
     this.level = 1;
     this.gameState = "MENU";
     keyListener.initkeyListener(this);
 };
 
 Game.prototype = {
     init(){
         ////console.log("game objects created");
         //initialize the game objects
         ////console.log("this is the current level: ", this.level);
         //this.started = true;
         ////console.log("Game will start now");
         this.invaders = generateInvaders(this, this.level);
         this.player.health = 100;
         this.gameObjects =  [this.player, ...this.invaders];
         this.player.drawHealth();
         /*if(this.gameState === "LEVELWON"){
             ////console.log("restart request animation frame");
          
             this.gameState = "RUNNING";
             tick(0);
         }*/
         this.gameState = "RUNNING";
        // requestAnimationFrame(tick);
     },
     update(delta){
         if(this.gameState === "PAUSED" 
             || this.gameState === "GAMEOVER" 
             || this.gameState === "MENU" 
             || this.gameSate === "LEVELWON"){
             return;
         }
         if(this.invaders.length < 1){
             this.gameState = "LEVELWON";
             return;
         }
         //Discard the objects that have .toRemove value set to true
         ////console.log("is the game objects array active: ", this.gameObjects);
         this.gameObjects = this.gameObjects.filter(objects => !objects.toRemove);
         this.invaders = this.invaders.filter(invader => !invader.toRemove);
         this.gameObjects.forEach(object => object.update(delta, this));
     },
     draw(){
        
         if(this.gameState === "PAUSED"){
            // ////console.log("should be showing pause screen");
             drawText("Paused", "30px Arial", "white", this.width / 2, this.height / 2, screen, true, "rgba(0,0,0,0.05)", this.width, this.height);
         }else if(this.gameState === "MENU"){
          
             return;
             /*drawText("Press Enter to start", "30px Arial", "white", this.width / 2, this.height / 2, screen, true, "black", this.width, this.height);*/
         }else if(this.gameState === "GAMEOVER"){
             drawText("Game Over", "30px Arial", "white", this.width / 2, this.height / 2, screen, true, "black", this.width, this.height);
             drawText("Press ENTER to try again", "30px Arial", "white", this.width / 2, this.height / 2 + 35, screen, true);
             this.player.health = 100;
         }else if(this.gameState === "LEVELWON"){
             drawText("Proceed to next level? Press Y or N",
             "30px Arial", "white", this.width / 2, this.height / 2, screen, true, "black", this.width, this.height);
         }else{
             screen.fillStyle = "black";
             screen.fillRect(0,0,this.width, this.height);
             this.gameObjects.forEach(object => object.draw(screen));
         }
     },
     addGameObject(gameObj){
         this.gameObjects.push(gameObj);
     },
     pause(){
         //////console.log(this.gameState, "PAUSED");
         if(this.gameState === "PAUSED" ){
             this.gameState = "RUNNING";  
         }else{
             this.gameState = "PAUSED";
         }
     },
     menu(){
         //console.log("In game menu function!"); 
         drawText("Press Enter to start", "30px Arial", "white", this.width / 2, this.height / 2, screen, true, "black", this.width, this.height);
         //console.log("tick being called from menu functions");
         tick(0);
     },
     restart(){
         this.gameState = "RUNNING";
         //console.log("should be restarting calling tick function");
         tick(0);
     }
 }
 
 
 let game = new Game(screenWidth, screenHeight);
 let lastTime = 0; 
 let accumulatedTime = 0;
 let deltaTime = 1/60; //the target framerate
 //let currentTime = 0;
 
 function tick(currentTime) {
     ////console.log("starting game loop");
     accumulatedTime += (currentTime - lastTime)/1000;
     lastTime = currentTime; 
     //simulate a consistent amount of in game time. If the time passed since the last frame is greater than the refresh rate, the game is behind, so up update until accumulated time is on par with the refresh rate
     while(accumulatedTime > deltaTime){
         game.update(deltaTime);
         accumulatedTime -= deltaTime;
      
     }
     game.draw();
     let frameId = requestAnimationFrame(tick);
     /*if(game.gameState == "QUIT"){
         there are timing issue when restarting the game loop... will need to revisit this issue.
         //console.log("in tick function killing game");
         cancelAnimationFrame(frameId);
     }*/
    ////console.log("End of game loop!");
 }
 window.addEventListener("load", e => {
     e.preventDefault();
     //////console.log("Ready");
     game.menu();
     //////console.log(game);
     //tick();
 });