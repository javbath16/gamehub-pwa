/* ============================================
   GameHub PWA - Registro del Service Worker,
   botón de instalación e indicador de modo
   ============================================ */

const PWA_CONFIG = window.PWA_CONFIG || { display: '?', orientation: '?' };

// ===== 1. REGISTRO DEL SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(reg => console.log('✅ Service Worker registrado. Scope:', reg.scope))
            .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
    });
}

// ===== 2. BOTÓN "INSTALAR" (beforeinstallprompt) =====
// Solo Chrome/Edge/Samsung Internet lanzan este evento, y solo cuando
// display es fullscreen, standalone o minimal-ui. En Safari (iOS) se
// instala con Compartir → "Agregar a inicio".
let eventoInstalacion = null;
const btnInstalar = document.getElementById('btnInstalar');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    eventoInstalacion = e;
    btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', async () => {
    if (!eventoInstalacion) return;
    eventoInstalacion.prompt();
    const { outcome } = await eventoInstalacion.userChoice;
    console.log('Resultado de la instalación:', outcome);
    eventoInstalacion = null;
    btnInstalar.hidden = true;
});

window.addEventListener('appinstalled', () => {
    btnInstalar.hidden = true;
    mostrarToast('🎮 GameHub se instaló correctamente');
});

// ===== 3. INDICADOR DE DISPLAY Y ORIENTACIÓN =====
// Muestra lo que el manifest DECLARA y lo que el navegador REALMENTE aplica.
const MODOS = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];

function modoActual() {
    for (const modo of MODOS) {
        if (window.matchMedia(`(display-mode: ${modo})`).matches) return modo;
    }
    if (window.navigator.standalone) return 'standalone (iOS)';
    return 'browser';
}

function orientacionActual() {
    if (screen.orientation && screen.orientation.type) return screen.orientation.type;
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
}

const chip = document.getElementById('pwaChip');

function actualizarChip() {
    const modo = modoActual();
    const coincide = modo.startsWith(PWA_CONFIG.display);
    chip.innerHTML = `
        <span class="pwa-chip-titulo"><i class="fas fa-mobile-screen"></i> PWA · ${PWA_CONFIG.display}</span>
        <span class="pwa-chip-detalle">
            <b>Manifest:</b> display <code>${PWA_CONFIG.display}</code> · orientation <code>${PWA_CONFIG.orientation}</code><br>
            <b>Actual:</b> display <code class="${coincide ? 'ok' : 'warn'}">${modo}</code> · <code>${orientacionActual()}</code><br>
            <b>Red:</b> ${navigator.onLine ? '<code class="ok">en línea</code>' : '<code class="warn">sin conexión</code>'}
            · ${window.innerWidth}×${window.innerHeight}px
        </span>`;
}

chip.addEventListener('click', () => chip.classList.toggle('abierto'));

MODOS.forEach(m => {
    window.matchMedia(`(display-mode: ${m})`).addEventListener('change', actualizarChip);
});
if (screen.orientation) screen.orientation.addEventListener('change', actualizarChip);
window.addEventListener('resize', actualizarChip);
window.addEventListener('online', () => { actualizarChip(); mostrarToast('🟢 Conexión restablecida'); });
window.addEventListener('offline', () => { actualizarChip(); mostrarToast('🔴 Sin conexión: trabajando desde la caché'); });
actualizarChip();

// ===== 4. TOAST =====
function mostrarToast(texto) {
    const toast = document.getElementById('pwaToast');
    toast.textContent = texto;
    toast.classList.add('visible');
    clearTimeout(mostrarToast._t);
    mostrarToast._t = setTimeout(() => toast.classList.remove('visible'), 3000);
}
