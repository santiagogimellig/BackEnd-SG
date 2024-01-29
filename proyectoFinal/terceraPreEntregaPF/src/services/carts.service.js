// Importo el DAO de carritos en memoria
import cartsDaoMemory from "../dao/carts.dao.js";

// Clase que proporciona servicios relacionados con la gestión de carritos
class CartsService {
    // Elimina un producto de un carrito específico
    deleteProductInCart(id_cart, id_product) {
        return cartsDaoMemory.deleteProductInCart(id_cart, id_product);
    }

    // Agrega un producto a un carrito específico
    addProductInCart(id_cart, id_product) {
        return cartsDaoMemory.addProductInCart(id_cart, id_product);
    }

    // Actualiza la cantidad de un producto en un carrito específico
    updateProductInCart(id_cart, id_product, quantity) {
        return cartsDaoMemory.updateProductInCart(id_cart, id_product, quantity);
    }

    // Obtiene la lista de carritos
    getCarts() {
        return cartsDaoMemory.getCarts();
    }

    // Agrega un nuevo carrito
    addCart(cart) {
        return cartsDaoMemory.addCart(cart);
    }

    // Obtiene un carrito por su identificador
    getCartById(id_cart) {
        return cartsDaoMemory.getCartById(id_cart);
    }

    // Actualiza un carrito con nuevos productos
    updateCart(id_cart, newProducts) {
        return cartsDaoMemory.updateCart(id_cart, newProducts);
    }

    // Elimina un carrito por su identificador
    deleteCart(id_cart) {
        return cartsDaoMemory.deleteCart(id_cart);
    }
}

// Exporto una instancia de la clase como servicio de carritos
export default new CartsService();