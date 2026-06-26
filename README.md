# Belleza & Aroma - Tienda de Cosméticos y Perfumería

## Introducción
Este proyecto es una tienda online de productos de belleza y perfume, desarrollada como entrega final del curso **Formación Front‑End**. La página muestra un diseño moderno, responsivo y accesible, con funcionalidades completas de carrito persistente, consumo de API pública y formulario de contacto.

## Tecnologías utilizadas
- **HTML5** – estructura semántica y accesibilidad.
- **CSS3** – diseño con gradientes, tipografías de Google Fonts (Montserrat, Playfair Display), layout con Flexbox y Grid, y efectos de hover.
- **JavaScript (Vanilla)** – lógica del carrito, sincronización con `localStorage`, consumo de la API **DummyJSON** (`https://dummyjson.com/products`), integración con **Formspree** para el formulario de contacto.
- **SEO & Open Graph** – meta‑tags, `og:title`, `og:description`, `og:image` y `author`.
- **Accesibilidad** – atributos `aria-live`, `role="status"` en los toasts y uso de contrastes adecuados.

## Características principales
- **Diseño premium** con fondo gradiente, tipografía elegante y micro‑animaciones.
- **AppBar sticky** con menú hamburguesa responsive.
- **Secciones de pantalla completa (100 vh)** para una experiencia inmersiva.
- **Carrito persistente** mediante `localStorage`; el botón **“Finalizar Compra”** está deshabilitado cuando el carrito está vacío.
- **Carga de productos** desde la API DummyJSON con manejo de errores y spinner de carga.
- **Formulario de contacto** integrado con Formspree (sin necesidad de backend).
- **SEO**: meta‑descripción, Open Graph y etiquetas `author`.
- **Accesibilidad**: avisos en vivo, roles y foco manejado correctamente.
- **Responsive**: diseño adaptable a móviles, tablets y escritorio.

## Cómo ejecutar el proyecto
1. **Clonar o descargar** el repositorio.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar un servidor local (recomendado) para evitar problemas con la carga de recursos:
   - Con **Python**:
     ```
     python -m http.server 8000
     ```
   - Con **Node.js** (`http-server`):
     ```
     npx http-server -p 8000
     ```
4. Abrir el navegador y navegar a `http://localhost:8000/index.html`.

> **Nota:** El proyecto también funciona abriendo directamente `index.html` en el navegador, pero algunas funcionalidades (como el video de YouTube) requieren un servidor local.

## Estructura del proyecto
```
├─ index.html          # página principal
├─ styles.css          # hoja de estilos principal
├─ script.js           # lógica de la aplicación
├─ favicon.svg         # ícono del sitio
├─ README.md           # este documento
└─ assets/             # imágenes y videos (si los hay)
```

## Despliegue
El proyecto incluye scripts para publicar en **GitHub Pages**:
- `deploy-gh-pages.ps1` – PowerShell (Windows).
- `deploy-gh-pages.sh` – Bash (Linux/macOS).
Ejecutar el script correspondiente desde la raíz del proyecto.

## Licencia
Este proyecto está bajo la licencia **MIT**. Puedes usar y modificar el código libremente.

---
Desarrollado por [Cesar Augusto Scremin](https://www.instagram.com/cesarscremindesign/).
