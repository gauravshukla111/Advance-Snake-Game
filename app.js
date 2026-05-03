const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake, dir, food, score, speed, running;

let highScore = localStorage.getItem("high") || 0;
document.getElementById("high").innerText = highScore;

// SOUND EFFECTS
const eatSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-bonus-reached-2065.mp3");
const overSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3");

// background music
const bgMusic = new Audio("https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;


// INIT
function init(){
  snake = [{x:200,y:200}];
  dir = "RIGHT";
  food = spawnFood();
  score = 0;

  speed = parseInt(document.getElementById("difficulty").value);

  running = true;

  document.getElementById("score").innerText = score;

  bgMusic.play();
}


// FOOD RANDOM
function spawnFood(){
  const colors = ["#ff4d4d","#ffa500","#ffcc00","#00ffcc"];
  return {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box,
    color: colors[Math.floor(Math.random()*colors.length)]
  };
}


// CONTROLS
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dir!=="DOWN") dir="UP";
  else if(e.key==="ArrowDown" && dir!=="UP") dir="DOWN";
  else if(e.key==="ArrowLeft" && dir!=="RIGHT") dir="LEFT";
  else if(e.key==="ArrowRight" && dir!=="LEFT") dir="RIGHT";

  // pause
  if(e.key===" ") running = !running;
});


//  START
function startGame(){
  document.getElementById("startScreen").style.display="none";
  init();
  requestAnimationFrame(loop);
}


//  LOOP
let lastTime = 0;

function loop(time){
  if(time - lastTime > 1000/speed){
    if(running) update();
    draw();
    lastTime = time;
  }
  requestAnimationFrame(loop);
}


// UPDATE
function update(){
  let head = {x:snake[0].x, y:snake[0].y};

  if(dir==="UP") head.y -= box;
  if(dir==="DOWN") head.y += box;
  if(dir==="LEFT") head.x -= box;
  if(dir==="RIGHT") head.x += box;

  //  COLLISION
  if(
    head.x<0 || head.y<0 ||
    head.x>=400 || head.y>=400 ||
    snake.some(s=>s.x===head.x && s.y===head.y)
  ){
    gameOver();
    return;
  }

  snake.unshift(head);

  //  EAT
  if(head.x===food.x && head.y===food.y){
    score++;
    eatSound.play();

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


// DRAW
function draw(){
  ctx.fillStyle="#000";
  ctx.fillRect(0,0,400,400);

  // real snake
  snake.forEach((s,i)=>{
    ctx.beginPath();
    ctx.fillStyle = i===0 ? "#fff" : "#888";
    ctx.arc(s.x+10,s.y+10,9,0,Math.PI*2);
    ctx.fill();
  });

  // eyes
  const head = snake[0];
  ctx.fillStyle="black";
  ctx.fillRect(head.x+5,head.y+5,3,3);
  ctx.fillRect(head.x+12,head.y+5,3,3);

  //  FRUIT
  ctx.beginPath();
  ctx.fillStyle = food.color;
  ctx.arc(food.x+10,food.y+10,8,0,Math.PI*2);
  ctx.fill();

  // pause text
  if(!running){
    ctx.fillStyle="white";
    ctx.font="20px sans-serif";
    ctx.fillText("Paused",160,200);
  }
}


// SPEED
function changeSpeed(val){
  speed += val;

  if(speed < 2) speed = 2;
  if(speed > 20) speed = 20;
}


// GAME OVER
function gameOver(){
  running = false;
  bgMusic.pause();
  overSound.play();
  document.getElementById("gameOver").style.display="flex";
}


// RESTART
function restart(){
  document.getElementById("gameOver").style.display="none";
  init();
}


//THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}