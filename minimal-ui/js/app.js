/* ============================================
   GameHub - JavaScript Interactivo
   ============================================ */

// ===== 1. MENÚ RESPONSIVO =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ===== 2. BOTÓN "VER MÁS" EN CARDS =====
function mostrarInfo(id) {
    const info = document.getElementById(id);
    const boton = event.target;

    info.classList.toggle('active');

    if (info.classList.contains('active')) {
        boton.innerHTML = 'Ver menos';
    } else {
        boton.innerHTML = 'Ver más';
    }
}

// ===== 3. MODAL DE GALERÍA =====
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');

function abrirModal(src, titulo) {
    modal.classList.add('active');
    modalImg.src = src;
    modalCaption.textContent = titulo;
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
}

function cerrarModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera de la imagen
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        cerrarModal();
    }
});

// ===== 4. BOTÓN HERO - SCROLL SUAVE =====
document.getElementById('btnHero').addEventListener('click', () => {
    document.getElementById('generos').scrollIntoView({ behavior: 'smooth' });
});

// ===== 5. FORMULARIO DE CONTACTO =====
const formContacto = document.getElementById('formContacto');

formContacto.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = formContacto.querySelector('input[type="text"]').value;
    const email = formContacto.querySelector('input[type="email"]').value;

    if (nombre && email) {
        alert(`¡Gracias ${nombre}! Te has suscrito correctamente con el correo: ${email}`);
        formContacto.reset();
    }
});

// ===== 6. ANIMACIÓN AL HACER SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las cards y galería
document.querySelectorAll('.card, .galeria-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('🎮 GameHub cargado correctamente');