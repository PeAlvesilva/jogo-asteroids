// Configurações iniciais
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");

const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 0,
    width: 20,
    height: 30
};

let bullets = [];
let asteroids = [];
let lastTime = 0;
let gameOver = false;
let score = 0;

// Funções de desenho e lógica do jogo
function drawSpaceship() {
    ctx.save();
    ctx.translate(spaceship.x, spaceship.y);
    ctx.rotate(spaceship.angle);
    ctx.beginPath();
    ctx.moveTo(0, -spaceship.height / 2);
    ctx.lineTo(spaceship.width / 2, spaceship.height / 2);
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function moveSpaceship() {
    spaceship.x += Math.cos(spaceship.angle) * spaceship.speed;
    spaceship.y += Math.sin(spaceship.angle) * spaceship.speed;
    
    if (spaceship.x < 0) spaceship.x = canvas.width;
    if (spaceship.x > canvas.width) spaceship.x = 0;
    if (spaceship.y < 0) spaceship.y = canvas.height;
    if (spaceship.y > canvas.height) spaceship.y = 0;
}

function moveAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
        
        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;
    }
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * 5;
        bullet.y += Math.sin(bullet.angle) * 5;
        
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        for (let j = 0; j < asteroids.length; j++) {
            const asteroid = asteroids[j];
            const dx = bullet.x - asteroid.x;
            const dy = bullet.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.radius) {
                asteroids.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                score += 10;
                break;
            }
        }
    }
}

function detectShipAsteroidCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        const dx = spaceship.x - asteroid.x;
        const dy = spaceship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < spaceship.width / 2 + asteroid.radius) {
            gameOver = true;
            finalScore.textContent = `Sua pontuação final foi: ${score}`;
            gameOverScreen.style.display = "flex";
            canvas.style.display = "none";
            break;
        }
    }
}

function generateAsteroids() {
    if (Math.random() < 0.02) {
        const radius = Math.random() * 20 + 15;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        
        asteroids.push({ x, y, radius, dx, dy });
    }
}

function update(time) {
    const deltaTime = time - lastTime;
    lastTime = time;

    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveSpaceship();
    moveAsteroids();
    moveBullets();
    detectCollisions();
    detectShipAsteroidCollisions();
    generateAsteroids();
    
    drawSpaceship();
    drawAsteroids();
    drawBullets();
    drawScore();
    
    requestAnimationFrame(update);
}

function startGame() {
    score = 0;
    bullets = [];
    asteroids = [];
    gameOver = false;
    spaceship.x = canvas.width / 2;
    spaceship.y = canvas.height / 2;
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    canvas.style.display = "block";
    requestAnimationFrame(update);
}

// Eventos para iniciar/reiniciar o jogo
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

// Controle de nave com o mouse
canvas.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    const dx = mouseX - spaceship.x;
    const dy = mouseY - spaceship.y;
    spaceship.angle = Math.atan2(dy, dx);
});

setInterval(() => {
    if (!gameOver) {
        bullets.push({ x: spaceship.x, y: spaceship.y, angle: spaceship.angle });
    }
}, 100);