
var dog,HungryDog,happyDog;
var foodObj;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;
var database;
var garden, washroom, bedroom;

var gameState, readState;

function preload(){
  HungryDog=loadImage("virtual pet images/Dog.png");
  happyDog=loadImage("virtual pet images/happy dog.png");
  garden=loadImage("virtual pet images/Garden.png");
  washroom=loadImage("virtual pet images/Wash Room.png");
  bedroom=loadImage("virtual pet images/Bed Room.png");
}

function setup() {
  database = firebase.database()
  createCanvas(1000,400);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(HungryDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}

function draw() {
  background(46,139,87);

  currentTime=hour();
  if(currentTime===(lastFed+1))
  {
    update("playing");
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2))
  {
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4))
  {
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!="hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(HungryDog);
  }
  drawSprites();

}

//function to read Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
  function feedDog() {
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour(),
      gameState:"hungry"
    })
  }


//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}
