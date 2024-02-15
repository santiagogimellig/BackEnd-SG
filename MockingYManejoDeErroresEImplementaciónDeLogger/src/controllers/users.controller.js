// Importo la función 'createHash' desde el archivo de utilidades y el servicio 'UsersService' desde su respectivo archivo.
import { createHash } from "../helpers/utils.js";
import UsersService from "../services/users.services.js";

// Exporto la clase 'UsersController'.
export default class UsersController {
    // Método estático para obtener usuarios con un filtro opcional.
    static async get(query = {}) {
        // Obtengo todos los usuarios utilizando el servicio 'UsersService' con el filtro proporcionado.
        const users = await UsersService.findAll(query);
        // Devuelvo los usuarios obtenidos.
        return users;
    }

    // Método estático para crear un nuevo usuario.
    static async create(data) {
        // Creo un nuevo usuario utilizando el servicio 'UsersService' con los datos proporcionados.
        const user = await UsersService.create(data);
        // Devuelvo el usuario creado.
        return user;
    }

    // Método estático para obtener un usuario por su ID.
    static async getById(uid) {
        // Obtengo el usuario por su ID utilizando el servicio 'UsersService'.
        const user = await UsersService.findById(uid);
        // Si el usuario no existe, lanzo un error.
        if (!user) {
            throw new Error(`Id de usuario no encontrado ${uid}`);
        }
        // Devuelvo el usuario obtenido.
        return user;
    }

    // Método estático para obtener un usuario por su email.
    static async getByMail(email) {
        // Obtengo los usuarios con el email proporcionado utilizando el servicio 'UsersService'.
        const users = await UsersService.findAll({ email });
        // Devuelvo el primer usuario encontrado (si existe).
        return users[0];
    }

    // Método estático para actualizar un usuario por su ID.
    static async updateById(uid, data) {
        // Verifico si el usuario existe por su ID.
        await UsersController.getById(uid);
        // Registro en el logger que se está actualizando el usuario.
        req.logger.info("Actualizando el usuario");
        // Actualizo el usuario por su ID utilizando el servicio 'UsersService'.
        await UsersService.updateById(uid, data);
        // Registro en el logger que el usuario se ha actualizado correctamente.
        req.logger.info("Usuario actualizado correctamente");
    }

    // Método estático para actualizar la contraseña de un usuario por su email.
    static async updatePassword(email, newPassword) {
        // Registro en la consola que se está actualizando la clave del usuario.
        console.log("Actualizando clave del usuario");
        // Obtengo el usuario por su email.
        const users = await UsersController.get({ email });
        // Si no hay usuarios con el email proporcionado, lanzo un error.
        if (!users.length) {
            throw new Error(`El mail proporcionado no existe en la DB`);
        }
        // Actualizo la contraseña del usuario encontrado utilizando el servicio 'UsersService'.
        await UsersService.updateById(users[0]._id, { password: createHash(newPassword) });
        // Registro en la consola que la clave se ha actualizado correctamente.
        console.log("Clave correctamente actualizada");
    }

    // Método estático para eliminar un usuario por su ID.
    static async deleteById(uid) {
        // Verifico si el usuario existe por su ID.
        await UsersController.getById(uid);
        // Registro en la consola que se está eliminando el usuario.
        console.log("Eliminando el usuario");
        // Elimino el usuario por su ID utilizando el servicio 'UsersService'.
        await UsersService.deleteById(uid);
        // Registro en la consola que el usuario se ha eliminado correctamente.
        console.log("Usuario eliminado correctamente");
    }
}