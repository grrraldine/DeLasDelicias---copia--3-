// PRIMERA PARTE: CREACION DE CARDS

//Array de productos
const creaciones = [];

// Clase principal Productos
class Productos {
    constructor(nombre, precio, img, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = cantidad;
    }
}

// Clase ProductoEspecial con descuento. Herencia
class ProductoEspecial extends Productos {
    constructor(nombre, precio, img, cantidad, descuento) {
        super(nombre, precio, img, cantidad);
        this.descuento = descuento;
    }
    mostrarPrecioConDescuento() {
        return this.precio - (this.precio * this.descuento / 100);
    }
}

// Instancias de productos
const creacion1 = new Productos("Semillas de Algarrobo", 3.00, "./assets/producto1.png", 1);
const creacion2 = new ProductoEspecial("Biotextil Micelio", 60.00, "./assets/producto2.png", 1, 20); // Producto con descuento
const creacion3 = new Productos("Vasija Gress III", 30.00, "./assets/producto32.png", 1);

// Agregar productos al array
creaciones.push(creacion1, creacion2, creacion3);

//MOSTRAR EN EL DOM
// Selección del contenedor de tarjetas
const contenedorCards = document.querySelector('.shop-section');

// Mostrar productos 
creaciones.forEach(creacion => {

// Si el producto es especial, mostrar precio con descuento y precio normal tachado, sino precio normal
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

// SEGUNDA PARTE: CREACION DE CARRITO DE COMPRAS

const contenedorTBody = document.getElementById('id-t-body');
let carrito = [];

// Evento para agregar productos al carrito / Si el elemento en el que se hizo clic tiene la clase 'btn-agregar-carrito'

contenedorCards.addEventListener("click", e => {
    if (e.target.classList.contains('btn-agregar-carrito')) {

// La constante product guarda el elemento contenedor <div class="product-card">
// permite acceder a él y a sus hijos (como el nombre y el precio)

        const product = e.target.parentElement;
        const nombreProducto = product.querySelector('h4').textContent;
        
        //ACCESO A PROPIEDADES ORIGINALES. 
        // Encontrar el producto en el array `creaciones` para acceder a sus propiedades originales
        const productoOriginal = creaciones.find(p => p.nombre === nombreProducto);

        // Determinar el precio del producto (con o sin descuento)
        const precioProducto = productoOriginal instanceof ProductoEspecial
            ? productoOriginal.mostrarPrecioConDescuento()
            : productoOriginal.precio;
        

        const infoProduct = {
            cantidad: 1,
            nombre: nombreProducto,
            precio: precioProducto
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

        mostrarEnHTML();
    }
});


// TERCER PARTE: MOSTRAR EN HTML CARRITO DE COMPRAS

const mostrarEnHTML = () => {
    contenedorTBody.innerHTML = ``;
    let total = 0;

//Creacion de una fila por cada producto del carrito
    carrito.forEach(product => {
        const containerProduct = document.createElement('tr');
        containerProduct.classList.add('cart-product');

//Calculo subtotal y total
        let subtotal = product.precio * product.cantidad;
        total += subtotal;

//Insertar html en la fila creada
        containerProduct.innerHTML = `
            <td>
                <div class="producto-C">
                    <p id="nombrePlanta">${product.nombre}</p>
                </div>
            </td>
            <td id="precio">$${product.precio}</td>
            <td>
                <div class="cantidad-C" id="containerCantidad">
                    <button class="btn-popup" id="menos">-</button>
                    <p id="cantidad">${product.cantidad}</p>
                    <button class="btn-popup" id="mas">+</button>
                </div>
            </td>
            <td id="subtotal">$${subtotal}</td>
            <td>
                <button class="borrar-C" id="borrar">&#128465;</button>
            </td>
        `;
        
//Agregar fila al contenedor       
        contenedorTBody.append(containerProduct);

//Evento click boton menos y mas para restar o sumar

        containerProduct.querySelector("#menos").addEventListener("click", () => {
            if (product.cantidad > 1) {
                product.cantidad--;
                mostrarEnHTML();
            }
        });

        containerProduct.querySelector("#mas").addEventListener("click", () => {
            product.cantidad++;
            mostrarEnHTML();
        });

        containerProduct.querySelector("#borrar").addEventListener("click", () => {
            borrarProducto(product.nombre);
        });
    });

    // Actualizar el total del carrito
    const totalCarrito = document.getElementById('total');
    totalCarrito.textContent = `$${total}`; //template string permite insertar el valor de la var total en la cadena de texto
};

// Función para borrar un producto del carrito
const borrarProducto = (nombreProducto) => {
    carrito = carrito.filter(product => product.nombre !== nombreProducto);
    mostrarEnHTML();
};
