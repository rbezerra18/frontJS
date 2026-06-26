/**
 * Belleza & Aroma - Funcionalidades JavaScript
 * Desarrollado para interactividad completa de la tienda.
 */

document.addEventListener("DOMContentLoaded", () => {
    // === CONSTANTES Y VARIABLES DE ESTADO ===
    const API_URL = "https://dummyjson.com/products/category/beauty?limit=8";
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Crema Hidratante",
    description: "Crema ligera para piel seca.",
    price: 12.99,
    thumbnail: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    title: "Perfume Floral",
    description: "Aroma fresco y duradero.",
    price: 45.5,
    thumbnail: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    title: "Set de Maquillaje",
    description: "Incluye sombra, rímel y lápiz.",
    price: 30.0,
    thumbnail: "https://via.placeholder.com/150"
  }
];
    let cart = [];

    // === ELEMENTOS DEL DOM ===
    // Elementos del Carrito
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalAmount = document.getElementById("cart-total-amount");
    const cartBadge = document.getElementById("cart-badge");
    const checkoutBtn = document.getElementById("cart-checkout-btn");

    // Elementos de la Tienda / Productos
    const productsContainer = document.querySelector(".carousel-track");

    // Elementos de Contacto
    const contactForm = document.querySelector(".contact-form");
    const toastContainer = document.getElementById("toast-container");

    // === INICIALIZACIÓN ===
    inicializarCarrito();
    cargarProductos();
    registrarEventos();

    // === SISTEMA DE NOTIFICACIONES (TOASTS) ===
    /**
     * Muestra una notificación flotante en la pantalla.
     * @param {string} mensaje - El texto a mostrar.
     * @param {'success'|'error'} tipo - El tipo de notificación.
     */
    function mostrarToast(mensaje, tipo = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${tipo}`;

        // Icono según el tipo de notificación
        const icono = tipo === "success"
            ? '<span style="color: #2ecc71; font-weight: bold;">✓</span>'
            : '<span style="color: #e74c3c; font-weight: bold;">✕</span>';

        toast.innerHTML = `${icono} <span>${mensaje}</span>`;
        toastContainer.appendChild(toast);

        // Remover el elemento del DOM una vez termine la animación de salida
        toast.addEventListener("animationend", (e) => {
            if (e.animationName === "toastFadeOut") {
                toast.remove();
            }
        });
    }

    // === LÓGICA DEL CARRITO DE COMPRAS ===

    /**
     * Carga el carrito desde localStorage e inicializa la interfaz.
     */
    function inicializarCarrito() {
        const datosLocales = localStorage.getItem("belleza_aroma_cart");
        if (datosLocales) {
            try {
                cart = JSON.parse(datosLocales);
            } catch (error) {
                console.error("Error al parsear el carrito desde localStorage:", error);
                cart = [];
            }
        }
        actualizarUI();
    }

    /**
     * Guarda el estado actual del carrito en localStorage.
     */
    function guardarCarritoEnStorage() {
        localStorage.setItem("belleza_aroma_cart", JSON.stringify(cart));
    }

    /**
     * Actualiza el badge del header, la lista del panel y el precio total.
     */
    function actualizarUI() {
        // 1. Actualizar el contador dinámico en el botón del Header
        const totalItems = cart.reduce((acumulado, item) => acumulado + item.quantity, 0);
        cartBadge.textContent = totalItems;

        // Añadir micro-animación de sacudida si hay cambios en el contador
        cartToggleBtn.classList.remove("cart-pop");
        void cartToggleBtn.offsetWidth; // Truco para resetear la animación en el navegador
        if (totalItems > 0) {
            cartToggleBtn.classList.add("cart-pop");
        }

        // 2. Renderizar items dentro del drawer
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <span class="cart-empty-icon">🛒</span>
                    <p>Tu carrito está vacío</p>
                    <p style="font-size: 0.85rem; color: #999;">¡Explora nuestros productos y añade tus favoritos!</p>
                </div>
            `;
            cartTotalAmount.textContent = "$0.00";
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            let totalGeneral = 0;
            cartItemsContainer.innerHTML = "";

            cart.forEach(item => {
                const totalItem = item.price * item.quantity;
                totalGeneral += totalItem;

                const itemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-qty-wrap">
                                <button class="qty-btn btn-decrementar" aria-label="Disminuir cantidad" data-id="${item.id}">-</button>
                                <span class="qty-number">${item.quantity}</span>
                                <button class="qty-btn btn-incrementar" aria-label="Aumentar cantidad" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove-btn" aria-label="Eliminar producto" data-id="${item.id}">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
            });

            cartTotalAmount.textContent = `$${totalGeneral.toFixed(2)}`;
        }
    }

    /**
     * Agrega un producto seleccionado al carrito.
     * @param {Object} producto - Datos del producto a añadir.
     */
    function agregarAlCarrito(producto) {
        const itemExistente = cart.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.quantity += 1;
        } else {
            cart.push({
                id: producto.id,
                title: producto.title,
                price: producto.price,
                thumbnail: producto.thumbnail,
                quantity: 1
            });
        }

        guardarCarritoEnStorage();
        actualizarUI();
        mostrarToast(`"${producto.title}" añadido al carrito`);
    }

    /**
     * Modifica la cantidad de un producto específico en el carrito.
     * @param {number} id - Identificador del producto.
     * @param {number} cambio - Variación de la cantidad (+1 o -1).
     */
    function cambiarCantidad(id, cambio) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += cambio;

        if (item.quantity <= 0) {
            // Si la cantidad llega a cero, se remueve el producto
            cart = cart.filter(item => item.id !== id);
            mostrarToast("Producto eliminado del carrito");
        }

        guardarCarritoEnStorage();
        actualizarUI();
    }

    /**
     * Elimina un producto por completo del carrito.
     * @param {number} id - Identificador del producto.
     */
    function eliminarDelCarrito(id) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        cart = cart.filter(item => item.id !== id);
        guardarCarritoEnStorage();
        actualizarUI();
        mostrarToast(`"${item.title}" eliminado del carrito`, "error");
    }

    // === CONSUMO DE LA API DE PRODUCTOS ===

    /**
     * Muestra marcadores de posición (skeletons) mientras se cargan los productos de la API.
     */
    function mostrarSkeletons() {
        productsContainer.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            const skeletonHTML = `
                <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-button"></div>
                </div>
            `;
            productsContainer.insertAdjacentHTML("beforeend", skeletonHTML);
        }
    }

    /**
     * Realiza el fetch a la API externa de productos de belleza y los renderiza.
     */
    async function cargarProductos() {
        mostrarSkeletons();
        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) {
                throw new Error(`Error en la petición: Status ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            const productos = datos.products;

            // Limpiar contenedor de carga e insertar productos reales
            productsContainer.innerHTML = "";

            productos.forEach(prod => {
                const cardHTML = `
                    <article class="card" data-id="${prod.id}">
                        <img src="${prod.thumbnail}" alt="${prod.title}">
                        <h4>${prod.title}</h4>
                        <p>${prod.description}</p>
                        <p class="price" style="font-weight: 700; color: #7b3fe4; font-size: 1.15rem; margin: 0.5rem 0;">$${prod.price.toFixed(2)}</p>
                        <button class="btn add-to-cart-btn" 
                                data-id="${prod.id}" 
                                data-title="${prod.title}" 
                                data-price="${prod.price}" 
                                data-thumbnail="${prod.thumbnail}">
                            Agregar al carrito
                        </button>
                    </article>
                `;
                productsContainer.insertAdjacentHTML("beforeend", cardHTML);
            });
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            // Usar datos de respaldo en caso de error de red o API
            const productos = FALLBACK_PRODUCTS;
            // Limpiar contenedor y renderizar los productos de respaldo
            productsContainer.innerHTML = "";
            productos.forEach(prod => {
                const cardHTML = `
                    <article class="card" data-id="${prod.id}">
                        <img src="${prod.thumbnail}" alt="${prod.title}">
                        <h4>${prod.title}</h4>
                        <p>${prod.description}</p>
                        <p class="price" style="font-weight: 700; color: #7b3fe4; font-size: 1.15rem; margin: 0.5rem 0;">$${prod.price.toFixed(2)}</p>
                        <button class="btn add-to-cart-btn"
                                data-id="${prod.id}"
                                data-title="${prod.title}"
                                data-price="${prod.price}"
                                data-thumbnail="${prod.thumbnail}">
                            Agregar al carrito
                        </button>
                    </article>
                `;
                productsContainer.insertAdjacentHTML("beforeend", cardHTML);
            });
        }
    }

    // === REGISTRO DE EVENTOS DEL DOM ===

    function registrarEventos() {
        // 1. Abrir y Cerrar Carrito
        cartToggleBtn.addEventListener("click", () => {
            cartDrawer.classList.add("open");
            cartOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // Deshabilita scroll de fondo
        });

        const cerrarCarrito = () => {
            cartDrawer.classList.remove("open");
            cartOverlay.classList.remove("active");
            document.body.style.overflow = ""; // Restaura scroll de fondo
        };

        cartCloseBtn.addEventListener("click", cerrarCarrito);
        cartOverlay.addEventListener("click", cerrarCarrito);

        // 2. Interacciones dentro de las tarjetas de la tienda (Delegación de eventos)
        productsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-cart-btn")) {
                const btn = e.target;
                const producto = {
                    id: parseInt(btn.getAttribute("data-id")),
                    title: btn.getAttribute("data-title"),
                    price: parseFloat(btn.getAttribute("data-price")),
                    thumbnail: btn.getAttribute("data-thumbnail")
                };
                agregarAlCarrito(producto);
            }
        });

        // 3. Modificaciones desde dentro del Carrito (Delegación de eventos)
        cartItemsContainer.addEventListener("click", (e) => {
            // Identificar los botones e íconos pulsados
            const btnIncrementar = e.target.closest(".btn-incrementar");
            const btnDecrementar = e.target.closest(".btn-decrementar");
            const btnEliminar = e.target.closest(".cart-item-remove-btn");

            if (btnIncrementar) {
                const id = parseInt(btnIncrementar.getAttribute("data-id"));
                cambiarCantidad(id, 1);
            } else if (btnDecrementar) {
                const id = parseInt(btnDecrementar.getAttribute("data-id"));
                cambiarCantidad(id, -1);
            } else if (btnEliminar) {
                const id = parseInt(btnEliminar.getAttribute("data-id"));
                eliminarDelCarrito(id);
            }
        });

        // 4. Simulación de Compra (Checkout)
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return;

            // Simulación visual de proceso de compra
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = "Procesando...";

            setTimeout(() => {
                mostrarToast("¡Compra realizada con éxito! Gracias por tu preferencia.", "success");

                // Limpiar carrito y cerrar drawer
                cart = [];
                guardarCarritoEnStorage();
                actualizarUI();
                cerrarCarrito();

                // Restaurar botón de compra
                checkoutBtn.textContent = "Finalizar Compra";
            }, 1500);
        });

        // 5. Validación y Envío de Formulario con AJAX (Formspree)
        if (contactForm) {
            contactForm.addEventListener("submit", async (e) => {
                e.preventDefault(); // Detener el envío estándar de Formspree

                // Campos del formulario
                const nombreInput = document.getElementById("name");
                const emailInput = document.getElementById("email");
                const mensajeInput = document.getElementById("message");

                const nombre = nombreInput.value.trim();
                const email = emailInput.value.trim();
                const mensaje = mensajeInput.value.trim();

                // Validaciones adicionales del lado del cliente
                if (nombre.length < 3) {
                    mostrarToast("El nombre debe tener al menos 3 caracteres.", "error");
                    nombreInput.focus();
                    return;
                }

                // Expresión regular para validar formato de correo electrónico
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    mostrarToast("Por favor, introduce un correo electrónico válido.", "error");
                    emailInput.focus();
                    return;
                }

                if (mensaje.length < 10) {
                    mostrarToast("El mensaje debe contener al menos 10 caracteres.", "error");
                    mensajeInput.focus();
                    return;
                }

                // Enviar datos usando Fetch AJAX
                const botonEnviar = contactForm.querySelector("button[type='submit']");
                const textoOriginalBoton = botonEnviar.textContent;

                try {
                    botonEnviar.disabled = true;
                    botonEnviar.textContent = "Enviando...";

                    const endpoint = contactForm.getAttribute("action");
                    const datosFormulario = new FormData(contactForm);

                    const respuesta = await fetch(endpoint, {
                        method: "POST",
                        body: datosFormulario,
                        headers: {
                            "Accept": "application/json"
                        }
                    });

                    if (respuesta.ok) {
                        mostrarToast("¡Mensaje enviado con éxito! Nos contactaremos pronto.", "success");
                        contactForm.reset(); // Limpiar el formulario
                    } else {
                        throw new Error("Respuesta no satisfactoria del servidor");
                    }
                } catch (error) {
                    console.error("Error al enviar el formulario:", error);
                    mostrarToast("No pudimos enviar tu mensaje. Por favor intenta más tarde.", "error");
                } finally {
                    botonEnviar.disabled = false;
                    botonEnviar.textContent = textoOriginalBoton;
                }
            });
        }
    }
});
