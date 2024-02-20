import nodemailer from 'nodemailer'; // Importar nodemailer para enviar correos electrónicos
import config from '../config.js'; // Importar la configuración del correo desde el archivo config.js

// Definir la clase EmailService para manejar el envío de correos electrónicos
export default class EmailService {
    static #instance = null; // Declarar una propiedad estática privada para almacenar la instancia única de la clase

    constructor() {
        // Configurar el transporte de nodemailer con la información proporcionada en la configuración
        this.transport = nodemailer.createTransport({
            service: config.mail.service,
            port: config.mail.port,
            auth: {
                user: config.mail.user,
                pass: config.mail.password,
            }
        });
    }

    // Método para enviar un correo electrónico
    sendEmail(to, subject, html, attachments = []) {
        // Utilizar el transporte creado para enviar el correo electrónico con la información proporcionada
        return this.transport.sendMail({
            from: config.mail.user,
            to,
            subject,
            html,
            attachments,
        });
    }

    // Método para enviar un enlace de restablecimiento de contraseña por correo electrónico
    sendResetPasswordLink(token, email) {
        // Utilizar el método sendEmail para enviar un correo electrónico con el enlace de restablecimiento de contraseña
        return this.sendEmail(
            email,
            `Reseteo de clave`,
            `Este es el link para restaurar la clave http://localhost:8080/auth/pass-recovery-by-mail/${token}`
        );
    }

    // Método estático para obtener una instancia única de la clase EmailService
    static getInstance() {
        // Verificar si ya hay una instancia creada
        if (!EmailService.#instance) {
            // Si no hay una instancia creada, crear una nueva instancia y almacenarla en la propiedad estática privada
            EmailService.#instance = new EmailService();
        }
        // Devolver la instancia única creada o existente
        return EmailService.#instance;
    }
}