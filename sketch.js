var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var count;
var coinImage;
var fuelImage;
var fuelGroup;
var coinGroup;
var index;
var lifeImage;
var obstacle1image;
var obstacle2image;
var obstacle1group;
var obstacle2group;
//BP
function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  coinImage = loadImage("./assets/goldCoin.png");
  fuelImage = loadImage("./assets/fuelImage.png");
  lifeImage = loadImage("./assets/life.png");
  obstacle1image = loadImage("./assets/obstacle1.png");
  obstacle2image = loadImage("./assets/obstacle2.png");
}

//BP
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
 
}

//BP
function draw() {
  background(backgroundImage);
  
  if (playerCount === 2){
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderBoard();
  } 

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
