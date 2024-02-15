// Importo las funciones necesarias desde el archivo de utilidades y los servicios relacionados.
import { createHash, isValidPassword, tokenGenerator } from "../helpers/utils.js";
import CartsService from "../services/carts.services.js";
import UsersService from "../services/users.services.js";
import UsersController from "./users.controller.js";

// Exporto una clase llamada AuthController.
export default class AuthController {
    // Método estático para registrar un nuevo usuario.
    static async register(data) {
        // Extraigo los datos del objeto 'data'.
        const {
            first_name,
            last_name,
            email,
            password
        } = data;
        
        // Busco si ya existe un usuario con el mismo email.
        let user = await UsersService.findAll({ email });
        if (user.length > 0) {
            throw new Error("Usuario ya registrado");
        }

        // Creo un carrito para el usuario.
        const cart = await CartsService.create();

        // Creo un nuevo usuario con los datos proporcionados.
        user = await UsersService.create({
            first_name,
            last_name,
            email,
            password,
            cartId: cart._id
        });

        // Genero un token de autenticación para el usuario.
        const token = tokenGenerator(user);
        
        // Devuelvo el token generado.
        return token;
    }

    // Método estático para iniciar sesión.
    static async login(data) {
        // Extraigo el email y la contraseña del objeto 'data'.
        const { email, password } = data;

        // Busco el usuario por su email.
        const user = await UsersService.findAll({ email });
        if (user.length === 0) {
            throw new Error("Correo o contraseña invalidos");
        }

        // Verifico si la contraseña proporcionada es válida.
        const validPassword = isValidPassword(password, user);
        if (!validPassword) {
            throw new Error("Correo o contraseña invalidos");
        }

        // Genero un token de autenticación para el usuario.
        const token = tokenGenerator(user);
        
        // Devuelvo el token generado.
        return token;
    }

    // Método estático para restablecer la contraseña.
    static async resetPassword(data) {
        // Extraigo el email y la nueva contraseña del objeto 'data'.
        const { email, newPassword } = data;

        // Actualizo la contraseña del usuario correspondiente.
        await UsersController.updatePassword(email, newPassword);
    }
}