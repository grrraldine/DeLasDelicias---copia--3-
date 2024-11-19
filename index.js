// PRIMERA PARTE: CREACIÓN DE CARDS

// Array de productos
const creaciones = [];

// Clase principal Productos
class Productos {
    constructor(nombre, precio, img, cantidad, descripcion = "") {
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = cantidad;
        this.descripcion = descripcion; // Nueva propiedad descripción
    }
}

// Clase ProductoEspecial con descuento. Herencia
class ProductoEspecial extends Productos {
    constructor(nombre, precio, img, cantidad, descuento, descripcion = "") {
        super(nombre, precio, img, cantidad, descripcion);
        this.descuento = descuento;
    }
    mostrarPrecioConDescuento() {
        return this.precio - (this.precio * this.descuento / 100);
    }
}

// Instancias de productos
const creacion1 = new Productos("Semillas de Algarrobo", 3.00, "./assets/producto1.png", 1, "Semillas autoctonas");
const creacion2 = new ProductoEspecial("Biotextil Micelio", 60.00, "./assets/producto2.png", 1, 20, "Biotextil a partir de micelio");
const creacion3 = new Productos("Vasija Gress III", 30.00, "./assets/producto32.png", 1, "Vasija artesanal");

// Agregar productos al array
creaciones.push(creacion1, creacion2, creacion3);

// Mostrar en el DOM
const contenedorCards = document.querySelector('.shop-section');

creaciones.forEach(creacion => {
    let precioHTML;
    if (creacion instanceof ProductoEspecial) {
        const precioConDescuento = creacion.mostrarPrecioConDescuento();
        precioHTML = `
            <p><span style="text-decoration: line-through; color: #a9a9a9;">$${creacion.precio}</span> $${precioConDescuento}</p>
        `;
    } else {
        precioHTML = `<p>$${creacion.precio}</p>`;
    }

// Generar la tarjeta del producto
    contenedorCards.innerHTML += `
        <div class="product-card">
            <img src="${creacion.img}" alt="${creacion.nombre}" />
            <div class="text-box">
                <h4>${creacion.nombre}</h4>
                ${precioHTML}
            </div>
            <button class="btn-agregar-carrito">Añadir al carrito</button>
        </div>
    `;
});

// Delegación de eventos para los botones "Añadir al carrito"
contenedorCards.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-agregar-carrito")) {
        const eventAbrirPopup = new CustomEvent('abrirCarrito');
        window.dispatchEvent(eventAbrirPopup);
    }
});

// SEGUNDA PARTE: CREACIÓN DE CARRITO DE COMPRAS

const contenedorTBody = document.getElementById('id-t-body');
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Cargar carrito desde localStorage

// Evento para agregar productos al carrito
contenedorCards.addEventListener("click", e => {
    if (e.target.classList.contains('btn-agregar-carrito')) {
        const product = e.target.parentElement;
        const nombreProducto = product.querySelector('h4').textContent;
        const productoOriginal = creaciones.find(p => p.nombre === nombreProducto);
        const precioProducto = productoOriginal instanceof ProductoEspecial
            ? productoOriginal.mostrarPrecioConDescuento()
            : productoOriginal.precio;

        const infoProduct = {
            cantidad: 1,
            nombre: nombreProducto,
            precio: precioProducto,
            imagen: productoOriginal.img,
            descripcion: productoOriginal.descripcion
        };

// Verificar si el producto ya está en el carrito
        const exists = carrito.some(product => product.nombre === infoProduct.nombre);

        if (exists) {
            carrito = carrito.map(product => {
                if (product.nombre === infoProduct.nombre) {
                    product.cantidad++;
                }
                return product;
            });
        } else {
            carrito.push(infoProduct);
        }

        guardarCarrito(); // Guardar el carrito en localStorage
        mostrarEnHTML();
    }
});

// TERCERA PARTE: MOSTRAR EN HTML CARRITO DE COMPRAS

const mostrarEnHTML = () => {
    contenedorTBody.innerHTML = ``;
    let total = 0;

    carrito.forEach(product => {
        const containerProduct = document.createElement('tr');
        containerProduct.classList.add('cart-product');

        let subtotal = product.precio * product.cantidad;
        total += subtotal;

        containerProduct.innerHTML = `
            <td>
                <div class="product-details">
                    <div class="imgTexto">
                        <img src="${product.imagen}" alt="${product.nombre}" class="product-thumbnail" />
                        <div class="product-info">
                            <p class="product-name">${product.nombre}</p>
                            <p class="product-description">${product.descripcion}</p>
                            <p class="product-price">Precio: $${product.precio}</p>
                            <p class="product-subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
                        </div>
                    </div>

                    <div class="quantity-control">
                        <div class="container-quantity">
                            <button class="btn-popup" id="menos">-</button>
                            <p id="cantidad">${product.cantidad}</p>
                            <button class="btn-popup" id="mas">+</button>
                        </div>
                    </div>
                    <button class="btn-popup" id="borrar">ELIMINAR</button>
                </div>
            </td>
        `;

        contenedorTBody.append(containerProduct);

        containerProduct.querySelector("#menos").addEventListener("click", () => {
            if (product.cantidad > 1) {
                product.cantidad--;
                guardarCarrito();
                mostrarEnHTML();
            }
        });

        containerProduct.querySelector("#mas").addEventListener("click", () => {
            product.cantidad++;
            guardarCarrito();
            mostrarEnHTML();
        });

        containerProduct.querySelector("#borrar").addEventListener("click", () => {
            borrarProducto(product.nombre);
        });
    });

    const totalCarrito = document.getElementById('total');
    totalCarrito.textContent = `$${total.toFixed(2)}`;
};

// Función para guardar el carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Función para borrar un producto del carrito
const borrarProducto = (nombreProducto) => {
    carrito = carrito.filter(product => product.nombre !== nombreProducto);
    guardarCarrito();
    mostrarEnHTML();
};

// Evento para vaciar todo el carrito
document.querySelector('.clear-cart').addEventListener('click', () => {
    carrito = [];
    guardarCarrito();
    mostrarEnHTML();
});

// Mostrar el carrito al cargar la página
mostrarEnHTML();
