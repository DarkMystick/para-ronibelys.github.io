const galaxia = document.getElementById('galaxia');
const frases = [
    "te quiero", "me gustas", "tus rizos", "tus ojos oscuros", 
    "tus labios", "amor", "tu sonrisa", "tu seriedad", "hermosa",
    "mi mundo", "eres magia", "me encantas", "tu mirada", "siempre tú"
];
const emojis = ["💜", "✨", "🪐", "💘", "🌙", "☄️", "🌌", "🌹"];

let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
let zoom = 1, autoRotation = 0;

const totalPalabras = 350; 
const totalPuntos = 800; 

function init() {
    if (!galaxia) return;

    // 1. Crear Niebla (Nebulosa)
    const niebla = document.createElement('div');
    niebla.className = 'nebulosa';
    galaxia.appendChild(niebla);

    // 2. Crear Astros y Puntos
    for (let i = 0; i < totalPalabras; i++) crearAstro(i, 'frase');
    for (let i = 0; i < totalPuntos; i++) crearAstro(i, 'punto');

    // 3. Estrellas de fondo infinito
    for (let i = 0; i < 200; i++) {
        const fondo = document.createElement('div');
        fondo.className = 'punto';
        const x = (Math.random() - 0.5) * 5000;
        const y = (Math.random() - 0.5) * 5000;
        const z = -2000; 
        fondo.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        fondo.style.opacity = Math.random() * 0.5;
        galaxia.appendChild(fondo);
    }

    // 4. Iniciar Meteoritos
    for (let i = 0; i < 15; i++) setTimeout(lanzarMeteorito, Math.random() * 5000);
}

function crearAstro(i, tipo) {
    if (!galaxia) return;
    const el = document.createElement('div');
    if (tipo === 'frase') {
        el.className = 'astro';
        el.innerText = Math.random() > 0.3 ? frases[Math.floor(Math.random() * frases.length)] : emojis[Math.floor(Math.random() * emojis.length)];
        el.style.color = `hsl(${270 + Math.random() * 40}, 80%, 85%)`;
        el.style.fontSize = (Math.random() * 12 + 8) + "px";
    } else {
        el.className = 'punto';
        el.style.setProperty('--d', (2 + Math.random() * 4) + 's');
    }

    const angle = i * 0.2;
    const distance = 10 * angle;
    const spiralAngle = angle + (Math.floor(Math.random() * 2) * Math.PI); 
    const x = Math.cos(spiralAngle) * distance + (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 150; 
    const z = Math.sin(spiralAngle) * distance + (Math.random() - 0.5) * 200;

    const posTransform = `translate3d(${x}px, ${y}px, ${z}px)`;
    el.style.transform = posTransform;
    if (tipo === 'frase') el.setAttribute('data-pos', posTransform);
    galaxia.appendChild(el);
}

function lanzarMeteorito() {
    if (!galaxia) return;
    const met = document.createElement('div');
    met.className = 'meteorito';
    const x = (Math.random() - 0.5) * 2500;
    const z = (Math.random() - 0.5) * 2000;
    const duracion = 1 + Math.random() * 1.5;
    met.style.setProperty('--x', `${x}px`);
    met.style.setProperty('--z', `${z}px`);
    met.style.setProperty('--t', `${duracion}s`);
    galaxia.appendChild(met);

    setTimeout(() => {
        crearExplosion(x, 400, z);
        met.remove();
        setTimeout(lanzarMeteorito, Math.random() * 3000);
    }, duracion * 1000);
}

function crearExplosion(x, y, z) {
    if (!galaxia) return;
    const nucleo = document.querySelector('.nucleo');
    if(nucleo) {
        nucleo.style.filter = 'blur(10px) brightness(3)';
        setTimeout(() => nucleo.style.filter = 'blur(12px) brightness(1)', 100);
    }
    for (let i = 0; i < 10; i++) {
        const chispa = document.createElement('div');
        chispa.className = 'chispa-explosion';
        chispa.style.setProperty('--ex', `${(Math.random() - 0.5) * 400}px`);
        chispa.style.setProperty('--ey', `${(Math.random() - 0.5) * 400}px`);
        chispa.style.setProperty('--ez', `${(Math.random() - 0.5) * 400}px`);
        chispa.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        galaxia.appendChild(chispa);
        setTimeout(() => chispa.remove(), 800);
    }
}

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.12;
    targetY = (e.clientY - window.innerHeight / 2) * -0.12;
});

document.addEventListener('wheel', (e) => {
    zoom = Math.min(Math.max(0.3, zoom + e.deltaY * -0.001), 3);
});

function animate() {
    if (!galaxia) return;
    autoRotation += 0.08;
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    const rotX = 65 + mouseY;
    const rotY = mouseX + autoRotation;

    galaxia.style.transform = `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    const astros = document.querySelectorAll('.astro');
    astros.forEach(astro => {
        const pos = astro.getAttribute('data-pos');
        if(pos) astro.style.transform = `${pos} rotateY(${-rotY}deg) rotateX(${-rotX}deg)`;
    });
    requestAnimationFrame(animate);
}

// Efecto Estela de Brillo Romántico
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return; 

    const chispa = document.createElement('div');
    chispa.className = 'chispa-estela';
    
    chispa.style.left = `${e.clientX}px`;
    chispa.style.top = `${e.clientY}px`;
    
    const size = Math.random() * 4 + 2;
    chispa.style.width = `${size}px`;
    chispa.style.height = `${size}px`;
    
    chispa.style.setProperty('--mx', `${(Math.random() - 0.5) * 60}px`);
    chispa.style.setProperty('--my', `${(Math.random() - 0.5) * 60 - 40}px`);

    document.body.appendChild(chispa);
    setTimeout(() => chispa.remove(), 1200);
});

// Inicialización de Eventos Seguros tras la carga del DOM
document.addEventListener('DOMContentLoaded', () => {
    const musica = document.getElementById('musica-fondo');
    const btnMusica = document.getElementById('btn-musica');
    const nucleoClick = document.getElementById('centro-universo');
    const contenedorCarta = document.getElementById('contenedor-carta');
    const btnCerrarCarta = document.getElementById('btn-cerrar-carta');
    const indicadorFlecha = document.querySelector('.indicador-flecha');

    if (musica) musica.volume = 0.4; 

    if (btnMusica && musica) {
        btnMusica.addEventListener('click', () => {
            if (musica.paused) {
                musica.play();
                btnMusica.innerHTML = "⏸️ Pausar música";
                btnMusica.classList.add('activo');
            } else {
                musica.pause();
                btnMusica.innerHTML = "🎵 Reproducir música";
                btnMusica.classList.remove('activo');
            }
        });
    }

    if (nucleoClick) {
        nucleoClick.addEventListener('click', () => {
            const flash = document.createElement('div');
            flash.className = 'destello-universal';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 1000);

            if (contenedorCarta) contenedorCarta.classList.add('mostrar');
            if (indicadorFlecha) indicadorFlecha.style.opacity = '0';
        });
    }

    if (btnCerrarCarta) {
        btnCerrarCarta.addEventListener('click', () => {
            if (contenedorCarta) contenedorCarta.classList.remove('mostrar');
            setTimeout(() => {
                if (indicadorFlecha) indicadorFlecha.style.opacity = '1';
            }, 500);
        });
    }
});

// Inicialización inmediata de gráficos
init();
animate();