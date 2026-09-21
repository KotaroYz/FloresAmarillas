const CONFIG = {
    maxFlowersOnScreen: 12,
    flowerSize: 120,
    minDistance: 140,          
    spawnInterval: 1500,       
    flowersPerSpawn: [1, 3],   
    lifeTime: [4000, 7000],    
    petalCount: 10,
    messages: [
        "Te extraño un montón"
    ]
};

const flowerContainer = document.querySelector('.flower-container');
const existingPositions = [];

function createFlower() {
    if (document.querySelectorAll('.flower').length >= CONFIG.maxFlowersOnScreen) return;

    const [minF, maxF] = CONFIG.flowersPerSpawn;
    const count = Math.floor(Math.random() * (maxF - minF + 1)) + minF;

    for (let i = 0; i < count; i++) {
        const pos = findValidPosition();
        if (!pos) return;

        const flower = buildFlowerElement();
        flower.style.left = pos.x + 'px';
        flower.style.top = pos.y + 'px';

        flower.style.animationDuration = (3 + Math.random() * 2) + 's';
        flower.style.animationDelay = (Math.random() * 0.5) + 's';

        flowerContainer.appendChild(flower);
        existingPositions.push(pos);

        createSparkles(pos.x + CONFIG.flowerSize / 2, pos.y + CONFIG.flowerSize / 2);

        const [minL, maxL] = CONFIG.lifeTime;
        const life = Math.random() * (maxL - minL) + minL;

        setTimeout(() => {
            flower.style.animation = `fadeOutFlower 0.8s ease-in forwards`;
            setTimeout(() => {
                flower.remove();
                const idx = existingPositions.indexOf(pos);
                if (idx > -1) existingPositions.splice(idx, 1);
            }, 800);
        }, life);
    }
}

function buildFlowerElement() {
    const flower = document.createElement('div');
    flower.classList.add('flower');

    const inner = document.createElement('div');
    inner.classList.add('flower-inner');

    // Pétalos
    for (let i = 0; i < CONFIG.petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const angle = (360 / CONFIG.petalCount) * i;
        petal.style.setProperty('--rot', angle + 'deg');
        petal.style.animationDelay = (i * 0.06) + 's';
        inner.appendChild(petal);
    }

    const center = document.createElement('div');
    center.classList.add('flower-center');
    inner.appendChild(center);

    flower.appendChild(inner);
    return flower;
}

function findValidPosition() {
    const padding = 20;
    const maxX = window.innerWidth - CONFIG.flowerSize - padding;
    const maxY = window.innerHeight - CONFIG.flowerSize - padding;

    for (let attempt = 0; attempt < 30; attempt++) {
        const x = Math.random() * maxX + padding / 2;
        const y = Math.random() * maxY + padding / 2;

        const valid = existingPositions.every(p => {
            const dist = Math.hypot(p.x - x, p.y - y);
            return dist > CONFIG.minDistance;
        });

        if (valid) return { x, y };
    }
    return null;
}

function createSparkles(cx, cy) {
    for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.classList.add('sparkle');
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 60;
        s.style.left = (cx + Math.cos(angle) * radius) + 'px';
        s.style.top = (cy + Math.sin(angle) * radius) + 'px';
        s.style.animationDelay = (Math.random() * 1.5) + 's';
        document.body.appendChild(s);

        setTimeout(() => s.remove(), 3000);
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = ['💛', '🌻', '✨', '💛'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (12 + Math.random() * 18) + 'px';
    heart.style.animationDuration = (8 + Math.random() * 8) + 's';
    document.getElementById('heartsBg').appendChild(heart);

    setTimeout(() => heart.remove(), 16000);
}

function typeMessage(text, el, speed = 60) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
    }, speed);
}

const btnMusica = document.getElementById('musicBtn');
const ytFrame = document.getElementById('ytFrame');
const videoId = 'bsChP26NLgk';
let musicPlaying = false;

btnMusica.addEventListener('click', () => {
    if (!musicPlaying) {
        ytFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
        btnMusica.classList.add('playing');
        btnMusica.textContent = '🔊';
        musicPlaying = true;
    } else {
        ytFrame.src = '';
        btnMusica.classList.remove('playing');
        btnMusica.textContent = '🎵';
        musicPlaying = false;
    }
});

window.addEventListener('load', () => {
    const msg = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)];
    typeMessage(msg, document.getElementById('message'));


    setInterval(createFlower, CONFIG.spawnInterval);
    createFlower();

    setInterval(createHeart, 800);

    let msgIndex = 0;
    setInterval(() => {
        msgIndex = (msgIndex + 1) % CONFIG.messages.length;
        typeMessage(CONFIG.messages[msgIndex], document.getElementById('message'));
    }, 10000);
});

window.addEventListener('resize', () => {
    existingPositions.length = 0;
});