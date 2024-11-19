let submenuContent = document.getElementById("submenu-content");
let cart = document.getElementById("cart-button");
let closeButton = document.getElementById("close-cartx");


cart.addEventListener("click", function () {
    if (submenuContent.style.display === "none" || submenuContent.style.display === "") {
        submenuContent.style.display = "flex"; // Muestra el contenido del carrito
    } else {
        submenuContent.style.display = "none"; // Oculta el contenido del carrito
    }
});


closeButton.addEventListener("click", function () {
    submenuContent.style.display = "none"; // Oculta el contenido del carrito
});

window.addEventListener('abrirCarrito', function() {
    submenuContent.style.display = "flex"; // Muestra el popup del carrito
});