// Importo las funciones necesarias desde archivos locales
import { createHash } from "../helpers/utils.js"; // Importo la función createHash de utilidades
import UsersService from "../services/users.services.js"; // Importo el servicio de usuarios

// Defino y exporto la clase UsersController
export default class UsersController {
    // Método estático para obtener usuarios
    static async get(query = {}) {
        // Obtengo todos los usuarios utilizando el servicio de usuarios
        const users = await UsersService.findAll(query)
        return users; // Devuelvo los usuarios obtenidos
    }

    // Método estático para crear un usuario
    static async create(data) {
        // Creo un nuevo usuario utilizando los datos proporcionados y el servicio de usuarios
        const user = await UsersService.create(data)
        return user; // Devuelvo el usuario creado
    }

    // Método estático para obtener un usuario por su ID
    static async getById(uid) {
        // Obtengo el usuario por su ID utilizando el servicio de usuarios
        const user = await UsersService.findById(uid)
        if (!user) {
            throw new Error(`ID de usuario no encontrado: ${uid}`); // Manejo de errores si el usuario no existe
        }
        return user; // Devuelvo el usuario obtenido
    }

    // Método estático para obtener un usuario por su correo electrónico
    static async getByMail(email) {
        // Obtengo el usuario por su correo electrónico utilizando el servicio de usuarios
        const users = await UsersService.findAll({ email })
        return users[0]; // Devuelvo el primer usuario encontrado (asumiendo que solo debe haber uno por correo electrónico)
    }

    // Método estático para actualizar un usuario por su ID
    static async updateById(uid, data) {
        await UsersController.getById(uid); // Verifico si el usuario existe
        console.log("Actualizando el usuario");
        // Actualizo el usuario utilizando el servicio de usuarios
        await UsersService.updateById(uid, data);
        console.log("Usuario actualizado correctamente");
    }

    // Método estático para actualizar la contraseña de un usuario por su correo electrónico
    static async updatePassword(email, newPassword) {
        console.log("Actualizando clave del usuario");
        // Obtengo el usuario por su correo electrónico
        const users = await UsersController.get({ email });
        if (!users.length) {
            throw new Error(`El correo proporcionado no existe en la base de datos`); // Manejo de errores si el correo no existe
        }
        // Actualizo la contraseña del usuario utilizando su ID y la nueva contraseña encriptada
        await UsersService.updateById(users[0]._id, { password: createHash(newPassword) });
        console.log("Clave correctamente actualizada");
    }

    // Método estático para eliminar un usuario por su ID
    static async deleteById(uid) {
        await UsersController.getById(uid); // Verifico si el usuario existe
        console.log("Eliminando el usuario");
        // Elimino el usuario por su ID utilizando el servicio de usuarios
        await UsersService.deleteById(uid);
        console.log("Usuario eliminado correctamente");
    }
}
