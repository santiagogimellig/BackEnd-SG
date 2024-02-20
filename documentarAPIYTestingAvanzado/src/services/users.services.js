import { userRepository } from '../repositories/index.js'; // Importa el repositorio de usuarios para interactuar con la base de datos

// Define la clase UsersService para manejar las operaciones relacionadas con los usuarios
export default class UsersService {
    // Método estático para encontrar todos los usuarios según un filtro opcional
    static findAll(filter = {}) {
        return userRepository.get(filter); // Llama al método get del repositorio de usuarios y devuelve el resultado
    }
    
    // Método estático asincrónico para crear un nuevo usuario
    static async create(payload) {
        console.log("Creando un nuevo usuario"); // Imprime un mensaje de registro
        const user = await userRepository.create(payload); // Llama al método create del repositorio de usuarios para crear un nuevo usuario
        console.log(`Usuario creado correctamente (${user._id})`); // Imprime un mensaje de registro con el ID del usuario creado
        return user; // Devuelve el usuario creado
    }

    // Método estático asincrónico para encontrar un usuario por su ID
    static async findById(uid) {
        return userRepository.getCurrent(uid); // Llama al método getCurrent del repositorio de usuarios para encontrar un usuario por su ID y devuelve el resultado
    }

    // Método estático para actualizar un usuario por su ID
    static updateById(uid, payload) {
        return userRepository.updateById(uid, payload); // Llama al método updateById del repositorio de usuarios para actualizar un usuario por su ID y devuelve el resultado
    }

    // Método estático para eliminar un usuario por su ID
    static deleteById(uid) {
        return userRepository.deleteById(uid); // Llama al método deleteById del repositorio de usuarios para eliminar un usuario por su ID y devuelve el resultado
    }
}