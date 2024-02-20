// Importo funciones y servicios necesarios desde archivos locales
import { createHash, isValidPassword, tokenGenerator } from "../helpers/utils.js"; // Importo funciones de utilidad
import AuthServices from "../services/auth.services.js"; // Importo servicios de autenticación
import CartsService from "../services/carts.services.js"; // Importo servicios de carritos
import UsersService from "../services/users.services.js"; // Importo servicios de usuarios
import UsersController from "./users.controller.js"; // Importo el controlador de usuarios

// Defino y exporto la clase AuthController
export default class AuthController {
    // Método estático para el registro de usuarios
    static async register(data) {
        // Extraigo los datos necesarios del objeto data
        const {
            first_name,
            last_name,
            email,
            password,
            rol
        } = data
        // Verifico si ya existe un usuario con el mismo correo electrónico
        let user = await UsersService.findAll({ email })
        if (user.length > 0) {
            throw new Error("Usuario ya registrado")
        }
        // Creo un carrito para el nuevo usuario
        const cart = await CartsService.create()
        // Creo un nuevo usuario con los datos proporcionados
        user = await UsersService.create({
            first_name,
            last_name,
            email,
            password, 
            rol,
            cartId: cart._id // Asigno el ID del carrito al usuario
        })
        // Genero un token de autenticación para el usuario registrado
        const token = tokenGenerator(user)
        return token; // Devuelvo el token
    }
    
    // Método estático para el inicio de sesión de usuarios
    static async login(data) {
        // Extraigo el correo electrónico y la contraseña del objeto data
        const { email, password } = data
        // Busco al usuario por su correo electrónico en la base de datos
        const user = await UsersService.findAll({ email });
        if (user.length === 0) {
            throw new Error("Correo o contraseña inválidos")
        }
        // Verifico si la contraseña proporcionada coincide con la almacenada para el usuario
        const validPassword = isValidPassword(password, user);
        if (!validPassword) {
            throw new Error("Correo o contraseña inválidos")
        }
        // Genero un token de autenticación para el usuario que inició sesión
        const token = tokenGenerator(user, "login")
        return token; // Devuelvo el token
    }

    // Método estático para restablecer la contraseña de un usuario
    static async resetPassword(data) {
        // Extraigo el correo electrónico y la nueva contraseña del objeto data
        const { email, newPassword } = data
        // Actualizo la contraseña del usuario utilizando el controlador de usuarios
        await UsersController.updatePassword(email, newPassword)
    }

    // Método estático para obtener el enlace de recuperación de contraseña
    static async getRecoveryPasswordLink(user) {
        // Obtengo el enlace de recuperación de contraseña utilizando los servicios de autenticación
        await AuthServices.getRecoveryLink(user);
    }
}
