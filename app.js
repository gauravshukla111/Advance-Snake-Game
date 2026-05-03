const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake, dir, food, score, speed, running;

let highScore = localStorage.getItem("high") || 0;
document.getElementById("high").innerText = highScore;


// Game init (reset sab kuch)
function init(){
  snake = [{x:200,y:200}];
  dir = "RIGHT";
  food = spawnFood();
  score = 0;

  // difficulty se speed set
  speed = parseInt(document.getElementById("difficulty").value);

  running = true;

  document.getElementById("score").innerText = score;
}


// random food spawn
function spawnFood(){
  return {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
  };
}


// keyboard controls
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dir!=="DOWN") dir="UP";
  else if(e.key==="ArrowDown" && dir!=="UP") dir="DOWN";
  else if(e.key==="ArrowLeft" && dir!=="RIGHT") dir="LEFT";
  else if(e.key==="ArrowRight" && dir!=="LEFT") dir="RIGHT";

  // space = pause/resume
  if(e.key===" "){
    running = !running;
  }
});


//  game start
function startGame(){
  document.getElementById("startScreen").style.display="none";
  init();
  requestAnimationFrame(loop);
}


//  main loop
let lastTime = 0;

function loop(time){
  if(time - lastTime > 1000/speed){
    if(running) update();
    draw();
    lastTime = time;
  }

  requestAnimationFrame(loop);
}


//  update logic
function update(){
  let head = {x:snake[0].x, y:snake[0].y};

  if(dir==="UP") head.y -= box;
  if(dir==="DOWN") head.y += box;
  if(dir==="LEFT") head.x -= box;
  if(dir==="RIGHT") head.x += box;

  // collision check
  if(
    head.x<0 || head.y<0 ||
    head.x>=400 || head.y>=400 ||
    snake.some(s=>s.x===head.x && s.y===head.y)
  ){
    gameOver();
    return;
  }

  snake.unshift(head);

  //  food eat
  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText = score;

    if(score > highScore){
      highScore = score;
      localStorage.setItem("high", highScore);
      document.getElementById("high").innerText = highScore;
    }

    food = spawnFood();
  } else {
    snake.pop();
  }
}


//drawing
function draw(){
  ctx.fillStyle="#020617";
  ctx.fillRect(0,0,400,400);

  // snake
  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(s.x,s.y,box,box);
  });

  // food
  ctx.fillStyle="#ef4444";
  ctx.fillRect(food.x,food.y,box,box);

  // pause text
  if(!running){
    ctx.fillStyle="white";
    ctx.font="20px sans-serif";
    ctx.fillText("Paused",160,200);
  }
}


//speed control buttons
function changeSpeed(val){
  speed += val;

  if(speed < 2) speed = 2;
  if(speed > 20) speed = 20;
}


// game over
function gameOver(){
  running = false;
  document.getElementById("gameOver").style.display="flex";
}


// restart
function restart(){
  document.getElementById("gameOver").style.display="none";
  init();
}