// Importo el modelo de usuario desde el archivo user.model.js
import UserModel from "../models/user.model.js";
// Importo la clase Exception y la función createHash desde el archivo utils.js en el directorio helpers
import { Exception, createHash } from '../helpers/utils.js';

// Defino una clase llamada UserManager para manejar operaciones relacionadas con usuarios
export default class UserManager {
    // Defino un método estático para obtener usuarios de la base de datos
    // Puedo proporcionar criterios de búsqueda opcionales
    static async get(query = {}) {
        // Defino un objeto vacío para los criterios de búsqueda
        const criteria = {};
        // Utilizo el método find() del modelo UserModel para buscar usuarios en la base de datos
        // Paso los criterios de búsqueda al método find()
        const result = await UserModel.find(query);
        // Devuelvo el resultado de la búsqueda
        return result;
    }

    // Defino un método estático para obtener un usuario de la base de datos por su dirección de correo electrónico
    static async getByMail(email) {
        // Utilizo el método findOne() del modelo UserModel para buscar un usuario por su dirección de correo electrónico
        // Paso un objeto de consulta que busca un usuario por su dirección de correo electrónico
        const result = await UserModel.findOne({ email });
        // Devuelvo el resultado de la búsqueda
        return result;
    }

    // Defino un método estático para obtener un usuario de la base de datos por su ID
    static async getById(uid) {
        try {
            // Utilizo el método findById() del modelo UserModel para buscar un usuario por su ID
            // Paso el ID del usuario al método findById()
            const user = await UserModel.findById(uid);
            // Verifico si se encontró un usuario con el ID proporcionado
            if (!user) {
                // Si no se encontró ningún usuario, lanzo una excepción con un mensaje indicando que el usuario no existe
                throw new Exception('No existe el usuario', 404);
            }
            // Devuelvo el usuario encontrado
            return user;
        } catch (error) {
            // Si se produce un error durante la búsqueda, lo capturo e imprimo en la consola
            console.error('Error al crear el usuario', error.message);
        }
    }

    // Defino un método estático para crear un nuevo usuario en la base de datos
    static async create(newUser = {}) {
        try {
            // Utilizo el método create() del modelo UserModel para insertar un nuevo usuario en la base de datos
            // Paso los datos del nuevo usuario al método create()
            const user = await UserModel.create(newUser);
            // Devuelvo el usuario creado
            return user;
        } catch (error) {
            // Si se produce un error durante la creación del usuario, lo capturo e imprimo en la consola
            console.error('Error al crear el usuario', error.message);
            // Lanzo una excepción indicando que no se pudo crear el usuario
            throw new Exception("No se pudo crear el usuario ", 500);
        }
    }

    // Defino un método estático para actualizar la contraseña de un usuario en la base de datos
    static async update(email, newPassword) {
        try {
            // Utilizo el método updateOne() del modelo UserModel para actualizar la contraseña de un usuario
            // Paso un objeto de consulta que busca un usuario por su dirección de correo electrónico
            // Paso un objeto de actualización que establece la nueva contraseña del usuario utilizando la función createHash()
            const updatedUser = await UserModel.updateOne({ email }, {
                $set: {
                    password: createHash(newPassword)
                }
            });
            // Devuelvo el usuario actualizado
            return updatedUser;
        } catch (error) {
            // Si se produce un error durante la actualización del usuario, lo capturo e imprimo en la consola
            console.error('Error al actualizar el usuario', error.message);
            // Lanzo una excepción indicando que no se pudo actualizar el usuario
            throw new Exception("No se pudo actualizar el usuario ", 500);
        }
    }
}