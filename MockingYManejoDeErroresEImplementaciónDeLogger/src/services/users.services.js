// Importar el repositorio de usuarios desde '../repositories/index.js'
import { userRepository } from '../respositories/index.js'

// Definir la clase UsersService
export default class UsersService {
    // Método estático para encontrar todos los usuarios, con la opción de aplicar un filtro
    static findAll(filter = {}) {
        // Llamar al método get del repositorio de usuarios para encontrar todos los usuarios
        return userRepository.get(filter);
    }

    // Método estático asincrónico para crear un nuevo usuario
    static async create(payload) {
        // Registrar un mensaje de creación de usuario en el logger
        req.logger.info("Creando un nuevo usuario");
        // Crear un nuevo usuario utilizando el método create del repositorio de usuarios
        const user = await userRepository.create(payload);
        // Registrar un mensaje de éxito con el ID del usuario creado en el logger
        req.logger.info(`Usuario creado correctamente (${user._id})`);
        // Retornar el usuario creado
        return user;
    }

    // Método estático asincrónico para encontrar un usuario por su ID
    static async findById(uid) {
        // Llamar al método getCurrent del repositorio de usuarios para encontrar un usuario por su ID
        return userRepository.getCurrent(uid);
    }

    // Método estático para actualizar un usuario por su ID
    static updateById(uid, payload) {
        // Llamar al método updateById del repositorio de usuarios para actualizar un usuario por su ID
        return UserDao.updateById(uid, payload);
    }

    // Método estático para eliminar un usuario por su ID
    static deleteById(uid) {
        // Llamar al método deleteById del repositorio de usuarios para eliminar un usuario por su ID
        return UserDao.deleteById(uid);
    }
}
