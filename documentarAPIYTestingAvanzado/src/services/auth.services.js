// Importar la función verifyToken desde el archivo utils.js en la carpeta helpers
import { verifyToken } from "../helpers/utils.js";
// Importar la clase EmailService desde el archivo email.services.js en la carpeta actual
import EmailService from "./email.services.js";

// Exportar la clase AuthServices como módulo predeterminado
export default class AuthServices {
    // Definir un método estático llamado passwordRestore que acepta dos argumentos: email y token
    static async passwordRestore(email, token) {
        // Obtener una instancia única de EmailService utilizando su método estático getInstance
        const emailService = EmailService.getInstance();
        // Llamar al método sendResetPasswordLink de la instancia de EmailService
        // para enviar un enlace de restablecimiento de contraseña al correo electrónico proporcionado
        // pasando el token generado como argumento
        await emailService.sendResetPasswordLink(token, email)
    }
}