// Coloca uma sombra no header quando rola a página um pouquinho pra baixo
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Configura e inicia o fundo "high-tech" de partículas no Canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Desenha a partícula (bolinha) na tela do canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Move as partículas e faz elas quicarem e voltarem ao encostar nas bordas
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    resizeCanvas();
    particlesArray = [];
    
    // Reduz o número de bolinhas na tela se for celular, pra não travar
    const pixelFactor = window.innerWidth > 768 ? 12000 : 25000;
    let numberOfParticles = (canvas.height * canvas.width) / pixelFactor;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5;
        let x = Math.random() * (innerWidth - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2) + size * 2;
        
        let speed = window.innerWidth > 768 ? 0.4 : 0.2;
        let directionX = (Math.random() - 0.5) * speed;
        let directionY = (Math.random() - 0.5) * speed;
        let color = 'rgba(14, 165, 233, 0.4)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Conecta bolinhas com uma linha se chegarem perto uma da outra
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Distância máxima pra linha começar a aparecer entre as partículas
            let maxDist = window.innerWidth > 768 ? 120 : 80;

            if (distance < maxDist) {
                let opacityValue = 1 - (distance / maxDist);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(14, 165, 233, ${opacityValue * 0.35})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animação: limpa a tela e desenha tudo de novo em cada quadro
let animationFrameId;
let isAnimating = true;

function animate() {
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
    
    animationFrameId = requestAnimationFrame(animate);
}

// Otimização Estratégica: Pausar a renderização do canvas 
// quando a tela de boas-vindas não estiver vísivel. 
// Isso poupa muito a CPU e a Bateria do usuário e é muito valorizado tecnicamente!
const heroSection = document.getElementById('hero');
const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Se a seção inicial estiver visível, liga o canvas
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        } else {
            // Se rolar para baixo, para a animação das partículas
            isAnimating = false;
            cancelAnimationFrame(animationFrameId);
        }
    });
}, { threshold: 0 });

if (heroSection) {
    canvasObserver.observe(heroSection);
}

init();
animate();

// Lógica pro efeito do terminal digitando (tela preta) na página inicial
const typedTextContainer = document.getElementById('typed-text-container');
const textToType = `> Inicializando sistema...
> Carregando informações do candidato...
> [██████████--] 80% completado
> Habilidades detectadas: [Java, JS, SQL, Spring Boot, Angular, TypeScript]
> Perfil: Estudante resolutivo e colaborativo.
> Status: Pronto para novos desafios.
> Bem-vindo.`;

let i = 0;
function typeWriter() {
    if (i < textToType.length) {
        if(textToType.charAt(i) === '\n') {
            typedTextContainer.innerHTML += '<br/>';
        } else {
            typedTextContainer.innerHTML += textToType.charAt(i);
        }
        i++;
        
        // Muda a velocidade das letras aleatoriamente, parecendo uma pessoa de verdade digitando
        let speed = Math.random() * 20 + 20;
        
        // Dá uma pequena pausa quando pula de linha no terminal
        if(textToType.charAt(i-1) === '\n') {
            speed = 400;
        }
        
        setTimeout(typeWriter, speed);
    }
}

// Espera um pouco e já começa a escrever no terminal as letras
setTimeout(typeWriter, 800);

// Rola a página suavemente quando clica em algum link do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Fecha o menu lateral do mobile depois que o usuário clica num link
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Faz o botão hamburguer abrir e fechar o menu na versão mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if(navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Faz os elementos do site aparecerem com animação quando você rola a tela até eles
const sections = document.querySelectorAll('.section');

const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
};

const sectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Assim que apareceu, para de verificar pra poupar memória do celular
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});
