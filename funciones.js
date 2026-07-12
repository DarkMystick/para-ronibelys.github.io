const galaxia = document.getElementById('galaxia');
const frases = [
    "te quiero", "me gustas", "tus rizos", "tus ojos oscuros", 
    "tus labios", "amor", "tu sonrisa", "tu seriedad", "hermosa",
    "mi mundo", "eres magia", "me encantas", "tu mirada", "siempre tú"
];
const emojis = ["💜", "✨", "🪐", "💘", "🌙", "☄️", "🌌", "🌹"];

let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
let zoom = 1, autoRotation = 0;

// DETECCIÓN DE CELULAR: Ajusta las variables automáticamente si es una pantalla pequeña
const esCelular = window.innerWidth <= 600;

// Optimización masiva de elementos para eliminar el lag en móviles
const totalPalabras = esCelular ? 45 : 220;  
const totalPuntos = esCelular ? 120 : 450;   

function init() {
    if (!galaxia) return;

    // 1. Crear Niebla (Nebulosa)
    const niebla = document.createElement('div');
    niebla.className = 'nebulosa';
    galaxia.appendChild(niebla);

    // 2. Crear Astros y Puntos
    for (let i = 0; i < totalPalabras; i++) crearAstro(i, 'frase');
    for (let i = 0; i < totalPuntos; i++) crearAstro(i, 'punto');

    // 3. Estrellas de fondo infinito (Menos en celular para evitar lag)
    const fondoEstrellas = esCelular ? 60 : 150;
    for (let i = 0; i < fondoEstrellas; i++) {
        const fondo = document.createElement('div');
        fondo.className = 'punto';
        const x = (Math.random() - 0.5) * (esCelular ? 2000 : 5000);
        const y = (Math.random() - 0.5) * (esCelular ? 2000 : 5000);
        const z = -1500; 
        fondo.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        fondo.style.opacity = Math.random() * 0.5;
        galaxia.appendChild(fondo);
    }

    // 4. Iniciar Meteoritos (Menos cantidad en móviles)
    const maxMeteoritos = esCelular ? 5 : 12;
    for (let i = 0; i < maxMeteoritos; i++) setTimeout(lanzarMeteorito, Math.random() * 5000);
}

function crearAstro(i, tipo) {
    if (!galaxia) return;
    const el = document.createElement('div');
    if (tipo === 'frase') {
        el.className = 'astro';
        el.innerText = Math.random() > 0.3 ? frases[Math.floor(Math.random() * frases.length)] : emojis[Math.floor(Math.random() * emojis.length)];
        el.style.color = `hsl(${270 + Math.random() * 40}, 80%, 85%)`;
        
        // Letras ligeramente más compactas en móviles
        const sizeBase = esCelular ? (Math.random() * 6 + 9) : (Math.random() * 12 + 8);
        el.style.fontSize = sizeBase + "px";
    } else {
        el.className = 'punto';
        el.style.setProperty('--d', (2 + Math.random() * 4) + 's');
    }

    // COMPRESIÓN DE LA GALAXIA: Controla qué tan abierta es la espiral matemáticamente
    const factorAngulo = esCelular ? 0.35 : 0.2; 
    const factorDistancia = esCelular ? 4.5 : 10; 
    
    const angle = i * factorAngulo;
    const distance = factorDistancia * angle;
    const spiralAngle = angle + (Math.floor(Math.random() * 2) * Math.PI); 
    
    // Límites de dispersión reducidos para celulares (evita que se salga de la pantalla)
    const dispersionX = esCelular ? 70 : 200;
    const dispersionY = esCelular ? 80 : 150;
    const dispersionZ = esCelular ? 70 : 200;

    const x = Math.cos(spiralAngle) * distance + (Math.random() - 0.5) * dispersionX;
    const y = (Math.random() - 0.5) * dispersionY; 
    const z = Math.sin(spiralAngle) * distance + (Math.random() - 0.5) * dispersionZ;

    const posTransform = `translate3d(${x}px, ${y}px, ${z}px)`;
    el.style.transform = posTransform;
    if (tipo === 'frase') el.setAttribute('data-pos', posTransform);
    galaxia.appendChild(el);
}

function lanzarMeteorito() {
    if (!galaxia) return;
    const met = document.createElement('div');
    met.className = 'meteorito';
    const x = (Math.random() - 0.5) * (esCelular ? 1200 : 2500);
    const z = (Math.random() - 0.5) * (esCelular ? 1000 : 2000);
    const duracion = 1 + Math.random() * 1.5;
    met.style.setProperty('--x', `${x}px`);
    met.style.setProperty('--z', `${z}px`);
    met.style.setProperty('--t', `${duracion}s`);
    galaxia.appendChild(met);

    setTimeout(() => {
        crearExplosion(x, 400, z);
        met.remove();
        setTimeout(lanzarMeteorito, Math.random() * 4000);
    }, duracion * 1000);
}

function crearExplosion(x, y, z) {
    if (!galaxia) return;
    const nucleo = document.querySelector('.nucleo');
    if(nucleo) {
        nucleo.style.filter = 'blur(10px) brightness(3)';
        setTimeout(() => nucleo.style.filter = 'blur(12px) brightness(1)', 100);
    }
    
    // Menos partículas en explosiones para celulares
    const chispasMax = esCelular ? 4 : 10;
    for (let i = 0; i < chispasMax; i++) {
        const chispa = document.createElement('div');
        chispa.className = 'chispa-explosion';
        chispa.style.setProperty('--ex', `${(Math.random() - 0.5) * 200}px`);
        chispa.style.setProperty('--ey', `${(Math.random() - 0.5) * 200}px`);
        chispa.style.setProperty('--ez', `${(Math.random() - 0.5) * 200}px`);
        chispa.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        galaxia.appendChild(chispa);
        setTimeout(() => chispa.remove(), 800);
    }
}

// Eventos táctiles y de mouse optimizados
if (!esCelular) {
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.12;
        targetY = (e.clientY - window.innerHeight / 2) * -0.12;
    });

    document.addEventListener('wheel', (e) => {
        zoom = Math.min(Math.max(0.3, zoom + e.deltaY * -0.001), 3);
    });
} else {
    // Soporte básico y suave para touch en celulares sin saturar
    document.addEventListener('touchmove', (e) => {
        if(e.touches.length === 1) {
            targetX = (e.touches[0].clientX - window.innerWidth / 2) * 0.08;
            targetY = (e.touches[0].clientY - window.innerHeight / 2) * -0.08;
        }
    }, { passive: true });
}

function animate() {
    if (!galaxia) return;
    autoRotation += esCelular ? 0.12 : 0.08; // Rota un poquito más rápido en celular ya que hay menos elementos
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

// Efecto Estela (Desactivado en celulares para erradicar el lag por completo)
if (!esCelular) {
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
}

// Inicialización de Eventos Seguros tras la carga del DOM
document.addEventListener('DOMContentLoaded', () => {
    if (typeof nst !== 'undefined') { window.galaxia = document.getElementById('galaxia'); }
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
