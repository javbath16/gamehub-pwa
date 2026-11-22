# GameHub PWA — Conversión de la Aplicación Web One Page a PWA

Equipo JDKC: Javier · Dorys · Carlos · Kenay

La aplicación one page **GameHub** (U1 · Actividad 2) convertida en Aplicación Web Progresiva, en **cuatro versiones con el mismo contenido y diseño**. Lo único que cambia entre ellas es `display` y `orientation` en el `manifest.json`.

| Carpeta / URL | `display` | `orientation` | Icono | Integrante |
|---|---|---|---|---|
| `/browser/` | `browser` | `any` | GameHub **B** (verde) | __________ |
| `/minimal-ui/` | `minimal-ui` | `portrait` | GameHub **M** (amarillo) | __________ |
| `/standalone/` | `standalone` | `portrait` | GameHub **S** (azul) | __________ |
| `/fullscreen/` | `fullscreen` | `landscape` | GameHub **F** (rojo) | __________ |

> ¿Quieren otra orientación en alguna versión? Cambien **solo** la línea `"orientation"` de su `manifest.json` y el valor `orientation` en `window.PWA_CONFIG` al final de su `index.html` (es lo que muestra el indicador). Después suban `CACHE_NAME` en `sw.js` a `v2` para que el celular tome el cambio.

---

## 1. Qué se agregó a la app original

| Elemento | Archivo | Para qué |
|---|---|---|
| Web App Manifest | `manifest.json` | Nombre, iconos, colores, `start_url`, `scope`, `id`, **`display`** y **`orientation`** |
| Service Worker | `sw.js` | Precarga todos los archivos en **Cache Storage** y responde desde la caché cuando no hay red |
| Registro + instalación | `js/pwa.js` | Registra el SW, muestra el botón **Instalar** (`beforeinstallprompt`) y el indicador de modo |
| Estilos PWA | `css/pwa.css` | Botón Instalar, indicador, avisos y márgenes para el notch (`safe-area-inset`) |
| Iconos | `icons/` | 72–512 px, *maskable* para Android y `apple-touch-icon` para iOS |
| Font Awesome local | `vendor/fontawesome/` | Antes venía de un CDN; sin conexión los íconos no se veían |
| Imagen hero optimizada | `img/hero-bg.jpg` | Pasó de 3.9 MB (4K) a ~215 KB (1920×1080) para que la caché sea ligera |

`index.html`, `css/estilos.css` y `js/app.js` conservan el contenido original; solo se añadieron las etiquetas del manifest, el botón Instalar y los scripts de la PWA.

**Indicador PWA** (esquina inferior izquierda): tóquenlo durante la demostración. Muestra lo que **declara** el manifest y lo que el navegador **aplica realmente** (`display-mode` detectado con `matchMedia`, `screen.orientation.type`, tamaño de la ventana y si hay conexión). Se actualiza solo al girar el teléfono.

### Por qué cada versión es una app independiente
Las cuatro viven en el mismo dominio, así que cada una tiene su propio `scope` y `id` (`./` de su carpeta), su propio Service Worker y un nombre de caché distinto (`gamehub-standalone-v1`, etc.). Por eso se pueden instalar las cuatro en el mismo teléfono sin que se pisen.

---

## 2. Publicar en GitHub Pages (genera las 4 URLs)

1. Crear un repositorio **público** en GitHub, por ejemplo `gamehub-pwa`.
2. Subir **el contenido** de esta carpeta (que `index.html`, `browser/`, `minimal-ui/`, etc. queden en la raíz del repo).
3. *Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save*.
4. Esperar 1–2 minutos. Las URLs quedan así (cambien `USUARIO`):

```
https://USUARIO.github.io/gamehub-pwa/browser/
https://USUARIO.github.io/gamehub-pwa/minimal-ui/
https://USUARIO.github.io/gamehub-pwa/standalone/
https://USUARIO.github.io/gamehub-pwa/fullscreen/
```

`https://USUARIO.github.io/gamehub-pwa/` muestra una portada con las cuatro versiones.

**Si cada integrante debe tener la URL en su propia cuenta:** cada quien crea su repo y sube **solo su carpeta** (el contenido de `standalone/`, por ejemplo, en la raíz del repo). Funciona igual porque todas las rutas son relativas.

**Alternativa rápida:** Netlify Drop (app.netlify.com/drop) — arrastrar la carpeta y da una URL HTTPS al instante.

> Una PWA **necesita HTTPS** (o `localhost`). Abrir el `index.html` con doble clic (`file://`) no registra el Service Worker.

---

## 3. Lista de verificación antes de enviar las URLs

Hacerla **en un equipo y navegador distinto** al que se usó para desarrollar.

**En la computadora (Chrome o Edge)**
- [ ] F12 → *Application → Manifest*: sin errores, se ven nombre, iconos, `display` y `orientation`.
- [ ] *Application → Service Workers*: estado **activated and is running**.
- [ ] *Application → Cache Storage*: existe `gamehub-<modo>-v1` con todos los archivos.
- [ ] *Network → No throttling → Offline* y recargar: la página carga completa (imágenes e íconos incluidos).
- [ ] Instalar (icono ⊕ de la barra de direcciones o botón **Instalar**) y abrir la app.
- [ ] Desinstalar: en la app instalada, menú ⋮ → *Desinstalar GameHub…*, o en `chrome://apps` clic derecho → *Quitar de Chrome*.

**En Android (Chrome)**
- [ ] Abrir la URL → botón **Instalar** o menú ⋮ → *Instalar app* / *Agregar a la pantalla principal*.
- [ ] Abrir desde el icono, activar **modo avión** y volver a abrir: debe funcionar.
- [ ] Desinstalar: mantener presionado el icono → *Desinstalar* (o *Información de la app → Desinstalar*).

**En iPhone/iPad (Safari)**
- [ ] Compartir → *Agregar a inicio* → abrir desde el icono.
- [ ] Desinstalar: mantener presionado el icono → *Eliminar app*.

---

## 4. Guion para la demostración (cada integrante)

Antes de girar el teléfono, **activar la rotación automática** del sistema. Para la evaluación, mostrar primero el `manifest.json` de su versión y después el comportamiento.

### browser · `any` — Integrante: __________
- **Qué se espera:** la app se abre como una pestaña normal, con barra de direcciones y controles del navegador. Al girar, el contenido se adapta a vertical y horizontal (diseño responsivo).
- **Qué explicar:**
  - `browser` es el modo por defecto. Chrome **no ofrece el botón Instalar** con este modo (solo lo promueve con `fullscreen`, `standalone` o `minimal-ui`). Se agrega desde el menú ⋮ → *Agregar a la pantalla principal* y el icono abre una pestaña.
  - `orientation` solo se aplica cuando la app corre en su propia ventana; en una pestaña la controla el navegador. Por eso `any` es el valor coherente: rota libremente.
  - El Service Worker y la caché **sí funcionan**: con modo avión la página carga igual.

### minimal-ui · `portrait` — Integrante: __________
- **Qué se espera (Android/Chrome):** ventana propia con una barra mínima (título/URL, atrás y recargar). Al girar el teléfono a horizontal, la app **se queda en vertical**.
- **Qué explicar:**
  - `minimal-ui` es un punto intermedio entre `browser` y `standalone`: parece app pero conserva controles básicos de navegación.
  - Si el navegador no soporta `minimal-ui`, la especificación indica que cae a `browser`. **Safari en iOS no lo soporta** y lo abre como `browser`.
  - `portrait` bloquea la orientación vertical; el indicador muestra `portrait-primary` aunque el teléfono esté acostado.

### standalone · `portrait` — Integrante: __________
- **Qué se espera:** se ve como app nativa, sin barra del navegador; se conserva la barra de estado (hora, batería). Al girar a horizontal, **se queda en vertical**.
- **Qué explicar:**
  - Es el modo más común para PWA; aparece en el selector de apps recientes como una app más.
  - Es el **único modo que iOS soporta completamente**; en iOS la `orientation` se ignora y la app rota libremente.
  - Diferencia con minimal-ui: aquí no hay ningún control del navegador (para regresar se usan los enlaces de la propia app o el gesto atrás del sistema).

### fullscreen · `landscape` — Integrante: __________
- **Qué se espera (Android/Chrome):** ocupa **toda la pantalla**, sin barra de estado ni barra de navegación del sistema. Al abrirla con el teléfono vertical, **gira sola a horizontal** y se mantiene así aunque se gire el teléfono.
- **Qué explicar:**
  - Es el modo pensado para juegos y video, por eso combina con `landscape`.
  - Si el navegador no soporta `fullscreen` cae a `standalone`. **En iOS se comporta como `standalone`** y no bloquea la orientación.
  - Se agregaron márgenes `env(safe-area-inset-*)` para que el encabezado no quede debajo del notch o la cámara.

### Si algo no se comporta como se esperaba
`display` y `orientation` son **preferencias** declaradas por la app; el resultado depende del navegador, sistema operativo, versión, dispositivo y si la rotación automática está activada. En ese caso: mostrar el `manifest.json` correcto, abrir el indicador PWA y explicar qué valor declaró la app y cuál aplicó el dispositivo. **No modificar código durante la evaluación.**

Problemas comunes:
- **Instalé y sigue mostrando la versión vieja:** cerrar la app por completo y abrirla de nuevo (el SW nuevo se activa al recargar). Si persiste, desinstalar y volver a instalar.
- **La orientación no se bloquea:** revisar que se abrió **desde el icono instalado** (no desde la pestaña) y que la app quedó instalada como app (en Android aparece en *Ajustes → Apps*), no como simple acceso directo.
- **No aparece el botón Instalar:** la app ya está instalada, se está usando `browser`, o el navegador no es Chrome/Edge/Samsung Internet (en esos casos usar el menú del navegador).

---

## 5. Estructura

```
gamehub-pwa/
├── index.html            ← portada con los 4 enlaces
├── browser/              ← display: browser    · orientation: any
├── minimal-ui/           ← display: minimal-ui · orientation: portrait
├── standalone/           ← display: standalone · orientation: portrait
└── fullscreen/           ← display: fullscreen · orientation: landscape
    ├── index.html
    ├── manifest.json
    ├── sw.js
    ├── css/  (estilos.css, pwa.css)
    ├── js/   (app.js, pwa.js)
    ├── img/
    ├── icons/
    └── vendor/fontawesome/
```

Íconos: Font Awesome Free 6.4.0 (licencia en `vendor/fontawesome/LICENSE.txt`).
