class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement();
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving  = false;
  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // TA
  start() {

  player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuelGroup = new Group();
    coinGroup = new Group();

    obstacle1group = new Group();
    obstacle2group = new Group();

    var obstacle1position = [
      {x : width/2 - 150, y : height-1300, image : obstacle1image},
      {x : width/2 + 250, y : height-1800, image : obstacle1image},
      {x : width/2 - 180, y : height-3300, image : obstacle1image},
      {x : width/2 - 150, y : height-4300, image : obstacle1image},
      {x : width/2, y : 5300, image : obstacle1image}
    ];
    
    var obstacle2position = [
      {x : width/2 + 250, y : height-800, image : obstacle2image},
      {x : width/2 - 180, y : height-2300, image : obstacle2image},
      {x : width/2, y : height-2800, image : obstacle2image},
      {x : width/2 + 180, y : height-3300, image : obstacle2image},
      {x : width/2 + 150, y : height-4000, image : obstacle2image},
      {x : width/2 + 150, y : height-3800, image : obstacle2image},
      {x : width/2 - 250, y : height-4300, image : obstacle2image},
      {x : width/2 - 200, y : 4800, image : obstacle2image}
    ];

    this.addSprites(fuelGroup, 4, fuelImage, 0.02);

    this.addSprites(coinGroup, 20, coinImage, 0.09);

    this.addSprites(obstacle1group, obstacle1position.length, obstacle1image, 0.04, obstacle1position);

    this.addSprites(obstacle2group, obstacle2position.length, obstacle2image, 0.04, obstacle2position);
  }

  addSprites(spriteGroup, numberOfSprite, spriteImage, scale, positions = []) {
    for (var i = 0; i<numberOfSprite; i++) {

      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      else{
        x = random(width/2 + 150, width/2 - 150);
        y = random(-height * 4.5, height - 400); 
      }

      x = random(width/2 + 150, width/2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;

      spriteGroup.add(sprite);
    }
  }

  


  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200, 40);
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 +230, 100);
    this.leaderBoardTitle.html("leaderboard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3 - 60, 40);
    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 50, 80);
    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50, 130);
  }

  showLeaderBoard() {
    var leader1;
    var leader2;
    var players = Object.values(allPlayers);
    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      leader1 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader2 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
    }

    if (players[1].rank === 1) {
      leader1 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
      leader2 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

handleResetButton() {
  this.resetButton.mousePressed(()=>{
    database.ref("/").set({
      playerCount:0,
      gameState:0,
      players:{}
    });
    window.location.reload();
    
  });
}


  
  //SA
  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if (allPlayers !== undefined) {
      image(track,0,-height*5,width,height*6); 
      this.showLeaderBoard();
      this.showFuelBar();
      this.showLifeBar();
      var index = 0;
      for (var plr in allPlayers) {
        index = index+1;
        var x = allPlayers[plr].positionX
        var y = height-allPlayers[plr].positionY

        cars[index-1].position.x = x
        cars[index-1].position.y = y
       

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          this.handleFuel(index);
          this.handleCoin(index);

          camera.position.x = cars[index-1].position.x
          camera.position.y = cars[index-1].position.y


        }

      }

      if (this.playerMoving) {
        player.positionY += 5
        player.update();
      }

      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }

      this.handlePlayerControls(); 

      const finishLine = height*6 - 100;
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank);
        player.update()
        this.showRank()
      }

       drawSprites();
    }

    }

    handleFuel(index) {
      cars [index-1].overlap(fuelGroup, function(collector, collected){
        player.fuel = 185;
        collected.remove();
      });

      if (player.fuel > 0 && this.playerMoving) {
        player.fuel -= 0.3;
      }

      if (player.fuel <= 0) {
        gameState = 2;
        this.gameOver();
      }

    }

    handleCoin(index) {
      cars [index-1].overlap(coinGroup, function(collector, collected){
        player.score += 21;
        player.update();
        collected.remove();
      });
    } 

handlePlayerControls() {
  if(keyIsDown(UP_ARROW)){
    this.playerMoving = true;
    player.positionY += 10;
    player.update();
  }

  if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
    player.positionX -= 5;
    player.update();
  }

  if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300) {
    player.positionX += 5;
    player.update();
  }
}

showRank() {
  swal({
    title:`Awesome !!! ${"\n"} rank ${"\n"} ${player.rank}`,
    text:"You have reached the finnishline successfully",
    imageUrl:" https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize:"100x100",
    confirmButtonText:"OK!"
  });
}

gameOver() {
  swal({
    title:`gameover !!!`,
    text: "oops!! you lost the game",
    imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize:"100x100",
    confirmButtonText:"thanks !!! for playing"
  });
}

showFuelBar() {
  push();
  image(fuelImage, width/2 - 130, height-player.positionY-100, 20, 20);
  fill("white");
  rect(width/2 - 100, height - player.positionY-100, 185, 20);
  fill("yellow");
  rect(width/2 - 100, height - player.positionY-100, player.fuel, 20);
  noStroke();
  pop();
}

showLifeBar() {
  push();
  image(lifeImage, width/2 - 130, height-player.positionY-400, 20, 20);
  fill("white");
  rect(width/2 - 100, height - player.positionY-400, 185, 20);
  fill("red");
  rect(width/2 - 100, height - player.positionY-400, player.life, 20);
  noStroke();
  pop();
}


  }

