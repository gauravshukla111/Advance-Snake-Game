const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, dir, food, score, speed, running, lastTime;

let highScore = localStorage.getItem("high") || 0;
document.getElementById("high").innerText = highScore;

function init(){
  snake = [{x:200,y:200}];
  dir = "RIGHT";
  food = spawnFood();
  score = 0;
  speed = 6;
  running = true;
  lastTime = 0;

  document.getElementById("score").innerText = score;
  document.getElementById("gameOver").style.display = "none";
}

function spawnFood(){
  return {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
  };
}

document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dir!=="DOWN") dir="UP";
  else if(e.key==="ArrowDown" && dir!=="UP") dir="DOWN";
  else if(e.key==="ArrowLeft" && dir!=="RIGHT") dir="LEFT";
  else if(e.key==="ArrowRight" && dir!=="LEFT") dir="RIGHT";

  if(e.key===" "){
    running = !running;
    if(running) requestAnimationFrame(loop);
  }

  if(e.key==="r") restart();
});

function loop(timestamp){
  if(!running) return;

  if(timestamp - lastTime > 1000/speed){
    update();
    lastTime = timestamp;
  }

  draw();
  requestAnimationFrame(loop);
}

function update(){
  let head = {x:snake[0].x, y:snake[0].y};

  if(dir==="UP") head.y -= box;
  if(dir==="DOWN") head.y += box;
  if(dir==="LEFT") head.x -= box;
  if(dir==="RIGHT") head.x += box;

  // collision
  if(
    head.x<0 || head.y<0 ||
    head.x>=400 || head.y>=400 ||
    snake.some(s=>s.x===head.x && s.y===head.y)
  ){
    gameOver();
    return;
  }

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText = score;

    if(score > highScore){
      highScore = score;
      localStorage.setItem("high", highScore);
      document.getElementById("high").innerText = highScore;
    }

    food = spawnFood();
    speed += 0.3;
    beep();

  } else {
    snake.pop();
  }
}

function draw(){
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,400,400);

  // snake glow
  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? "#00ffd0" : "#00aa88";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffd0";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // food
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#ff0040";
  ctx.fillRect(food.x, food.y, box, box);
}

function gameOver(){
  running = false;
  document.getElementById("gameOver").style.display = "flex";
}

function restart(){
  init();
  requestAnimationFrame(loop);
}

function beep(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type="square";
  osc.frequency.value=300;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

init();
requestAnimationFrame(loop);