// Importo el modelo de usuario y la excepción desde sus archivos correspondientes
import UserModel from "../models/user.model.js";
import { Exception, createHash } from '../helpers/utils.js';

// Defino una clase UserManager que proporciona métodos para administrar usuarios
export default class UserManager {

    // Método "get" que recupera una lista de usuarios que coinciden con los criterios de búsqueda proporcionados
    // Los criterios de búsqueda se pueden especificar como un objeto que contiene condiciones de búsqueda
    static async get(query = {}) {
        const criteria = {};
        const result = await UserModel.find(query);
        return result;
    }

    // Método "getByMail" que busca un usuario por su dirección de correo electrónico en la base de datos y devuelve el usuario encontrado
    static async getByMail(email) {
        const result = await UserModel.findOne({ email });
        return result;
    }

    // Método "getById" que busca un usuario por su ID en la base de datos y devuelve el usuario encontrado
    static async getById(uid) {
        try {
            const user = await UserModel.findById(uid);
            if (!user) {
                throw new Exception('No existe el usuario', 404);
            }
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario por ID', error.message);
        }
    }

    // Método "create" que crea un nuevo usuario utilizando los datos proporcionados y lo guarda en la base de datos
    static async create(newUser = {}) {
        try {
            const user = await UserModel.create(newUser);
            return user;
        } catch (error) {
            console.error('Error al crear el usuario', error.message);
            throw new Exception("No se pudo crear el usuario ", 500);
        }
    }

    // Método "update" que actualiza la contraseña de un usuario en la base de datos utilizando su dirección de correo electrónico y la nueva contraseña proporcionada
    static async update(email, newPassword) {
        try {
            const updatedUser = await UserModel.updateOne({ email }, {
                $set: {
                    password: createHash(newPassword)
                }
            });
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar el usuario', error.message);
            throw new Exception("No se pudo actualizar el usuario ", 500);
        }
    }
}