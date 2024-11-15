let submenuContent = document.getElementById("submenu-content");
let cart = document.getElementById("cart-button");

cart.addEventListener("click", function () {
    if (submenuContent.style.display === "none" || submenuContent.style.display === "") {
        submenuContent.style.display = "block"; // Muestra el contenido del carrito
    } else {
        submenuContent.style.display = "none"; // Oculta el contenido del carrito
    }
});
