import CartDao from "../dao/cart.dao.js"; // Importar el DAO de carritos
import { Exception } from "../helpers/utils.js"; // Importar la clase Exception del archivo utils.js

// Definir la clase CartsService para manejar las operaciones relacionadas con los carritos
export default class CartsService {
    // Método estático para encontrar todos los carritos según un filtro opcional
    static findAll(filter = {}) {
        return CartDao.getAll(filter); // Llamar al método getAll del DAO de carritos y devolver el resultado
    }

    // Método estático asincrónico para crear un nuevo carrito
    static async create(payload) {
        console.log("Creando un carrito"); // Imprimir un mensaje de registro
        const cart = await CartDao.create(payload); // Llamar al método create del DAO de carritos para crear un nuevo carrito
        console.log(`Carrito creado correctamente ${cart._id}`); // Imprimir un mensaje de registro con el ID del carrito creado
        return cart; // Devolver el carrito creado
    }

    // Método estático para encontrar un carrito por su ID
    static findById(cid) {
        return CartDao.getById(cid); // Llamar al método getById del DAO de carritos para encontrar un carrito por su ID y devolver el resultado
    }

    // Método estático para actualizar un carrito por su ID
    static updateById(cid, payload) {
        return CartDao.updateById(cid, payload); // Llamar al método updateById del DAO de carritos para actualizar un carrito por su ID y devolver el resultado
    }

    // Método estático para eliminar un carrito por su ID
    static deleteById(cid) {
        return CartDao.deleteById(cid); // Llamar al método deleteById del DAO de carritos para eliminar un carrito por su ID y devolver el resultado
    }
}