# Belleza & Aroma - Tienda de Cosméticos y Perfumería

Este es un proyecto de demostración para una tienda premium de cosméticos y perfumería, desarrollado como parte de la Pre-Entrega del curso de Formaciónront-End. La página está diseñada con un enfoque moderno, minimalista y totalmente responsivo.

## Características Principales

- **Diseño de Impacto**: Uso de gradientes suaves y tipografías elegantes (Montserrat y Playfair Display).
- **Navegación Inteligente**:
  - `AppBar` fija (Sticky Header) que permanece visible al desplazar la página.
  - Menú móvil con efecto "hamburguesa" y cierre automático al hacer clic fuera del panel.
  - Desplazamiento suave (Smooth Scroll) con compensación de altura para el encabezado.
- **Secciones de Pantalla Completa (100vh)**: Cada sección principal está diseñada para ocupar el 100% de la altura de la pantalla, centrando el contenido verticalmente para una experiencia de usuario inmersiva.
- **Estructura Semántica**: Uso correcto de etiquetas HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`).
- **Formulario de Contacto**: Integración funcional con Formspree para la recepción de mensajes.
- **Layout Moderno**:
  - Grid y Flexbox para organizar productos y reseñas.
  - Video incorporado de YouTube ajustado al diseño.

## Archivos del Proyecto

- `index.html`: Estructura principal y contenido de la página.
- `styles.css`: Hoja de estilos optimizada, comentada en español y sin clases redundantes.
- `favicon.svg`: Icono personalizado de frasco de perfume.

## Cómo Visualizar

1. Clona el repositorio o descarga los archivos.
2. Abre `index.html` en cualquier navegador moderno.
3. Para la mejor experiencia (especialmente para el video de YouTube), se recomienda abrir el proyecto a través de un servidor local (como Live Server de VS Code).

## Publicación (GitHub Pages)

El proyecto incluye scripts de automatización para el despliegue en GitHub Pages:

- `deploy-gh-pages.ps1`: Script para usuarios de Windows (PowerShell).
- `deploy-gh-pages.sh`: Script para usuarios de Unix/Linux/Mac (Bash).

Para desplegar, simplemente ejecuta el script correspondiente en la terminal de la carpeta del proyecto.

---
Desarrollado por [Roberto Bezerra](https://robertojr.com.br).
