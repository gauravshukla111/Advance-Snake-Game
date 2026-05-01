const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{x:200, y:200}];
let direction = "RIGHT";

let food = {
  x: Math.floor(Math.random()*20)*box,
  y: Math.floor(Math.random()*20)*box
};

let score = 0;
let game;

document.addEventListener("keydown", changeDirection);

function changeDirection(e){
  if(e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if(e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if(e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if(e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw(){

  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,400,400);

  // snake
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle = i===0 ? "white" : "#aaa";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if(direction==="UP") headY -= box;
  if(direction==="DOWN") headY += box;
  if(direction==="LEFT") headX -= box;
  if(direction==="RIGHT") headX += box;

  // eat food
  if(headX === food.x && headY === food.y){
    score++;
    document.getElementById("score").innerText = score;

    food = {
      x: Math.floor(Math.random()*20)*box,
      y: Math.floor(Math.random()*20)*box
    };

  } else {
    snake.pop();
  }

  let newHead = {x:headX, y:headY};

  // collision
  if(
    headX < 0 || headY < 0 ||
    headX >= 400 || headY >= 400 ||
    collision(newHead, snake)
  ){
    clearInterval(game);
    alert("Game Over");
  }

  snake.unshift(newHead);
}

function collision(head, body){
  for(let i=0;i<body.length;i++){
    if(head.x === body[i].x && head.y === body[i].y){
      return true;
    }
  }
  return false;
}

function restart(){
  snake = [{x:200, y:200}];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
  };

  clearInterval(game);
  game = setInterval(draw, 120);
}

game = setInterval(draw, 120);