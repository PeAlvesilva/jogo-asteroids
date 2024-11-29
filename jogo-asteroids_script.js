// Configurações iniciais
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 0,
    width: 20,
    height: 30
};

const bullets = [];
const asteroids = [];

let lastTime = 0;
let gameOver = false;

// Função para desenhar a nave
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

// Função para desenhar asteroides
function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

// Função para desenhar os tiros
function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

// Função para movimentação da nave
function moveSpaceship() {
    spaceship.x += Math.cos(spaceship.angle) * spaceship.speed;
    spaceship.y += Math.sin(spaceship.angle) * spaceship.speed;
    
    // Condições de borda
    if (spaceship.x < 0) spaceship.x = canvas.width;
    if (spaceship.x > canvas.width) spaceship.x = 0;
    if (spaceship.y < 0) spaceship.y = canvas.height;
    if (spaceship.y > canvas.height) spaceship.y = 0;
}

// Função para movimentação dos asteroides
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

// Função para movimentação dos tiros
function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * 5;
        bullet.y += Math.sin(bullet.angle) * 5;
        
        // Remover tiros fora da tela
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Função para detectar colisões entre tiros e asteroides
function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        for (let j = 0; j < asteroids.length; j++) {
            const asteroid = asteroids[j];
            const dx = bullet.x - asteroid.x;
            const dy = bullet.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.radius) {
                asteroids.splice(j, 1); // Remove o asteroide
                bullets.splice(i, 1);   // Remove o tiro
                i--;
                break;
            }
        }
    }
}

// Função para detectar colisões entre a nave e asteroides
function detectShipAsteroidCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        const dx = spaceship.x - asteroid.x;
        const dy = spaceship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < spaceship.width / 2 + asteroid.radius) {
            gameOver = true;
            alert("Game Over!");
            break;
        }
    }
}

// Função para gerar asteroides
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

// Função para atualizar o jogo
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
    
    requestAnimationFrame(update);
}

// Função para iniciar o jogo
function startGame() {
    requestAnimationFrame(update);
}

// Funções de controle de nave com o mouse
canvas.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calcular o ângulo entre a nave e o cursor
    const dx = mouseX - spaceship.x;
    const dy = mouseY - spaceship.y;
    spaceship.angle = Math.atan2(dy, dx);
});

// Função de disparo automático
setInterval(() => {
    if (!gameOver) {
        bullets.push({
            x: spaceship.x,
            y: spaceship.y,
            angle: spaceship.angle
        });
    }
}, 100); // Disparo a cada 100ms

// Iniciar o jogo
startGame();
