// Importar la clase CartDao desde el archivo cart.dao.js
import CartDao from "../dao/cart.dao.js";
// Importar la clase Exception desde el archivo utils.js en el directorio helpers
import { Exception } from "../helpers/utils.js";

// Definir la clase CartsService
export default class CartsService {
    // Método estático para encontrar todos los carritos, con la opción de aplicar un filtro
    static findAll(filter = {}) {
        // Llamar al método getAll del CartDao para encontrar todos los carritos
        return CartDao.getAll(filter)
    }

    // Método estático asincrónico para crear un nuevo carrito
    static async create(payload) {
        // Registrar un mensaje de información indicando que se está creando un carrito
        req.logger.info("Creando un carrito")
        // Crear un nuevo carrito utilizando el método create del CartDao
        const cart = await CartDao.create(payload);
        // Registrar un mensaje de información indicando que el carrito se ha creado correctamente
        req.logger.info(`Carrito creado correctamente ${cart._id}`)
        // Retornar el carrito creado
        return cart;
    }

    // Método estático para encontrar un carrito por su ID
    static findById(cid) {
        // Llamar al método getById del CartDao para encontrar un carrito por su ID
        return CartDao.getById(cid)
    }

    // Método estático para actualizar un carrito por su ID
    static updateById(cid, payload) {
        // Llamar al método updateById del CartDao para actualizar un carrito por su ID
        return CartDao.updateById(cid, payload)
    }

    // Método estático para eliminar un carrito por su ID
    static deleteById(cid) {
        // Llamar al método deleteById del CartDao para eliminar un carrito por su ID
        return CartDao.deleteById(cid)
    }
}
