// Importo el módulo nodemailer y la configuración del archivo de configuración
import nodemailer from "nodemailer";
import { config } from "../../config/config.js";

// Obtengo las credenciales del administrador y el nombre del comercio desde la configuración
const adminEmail = config.gmail.adminAccount;
const adminPass = config.gmail.adminPass;
const ecommerceName = config.business.ECOMMERCE_NAME;

// Configuración del transporte para el envío de correos electrónicos usando SMTP de Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

// Plantilla de correo electrónico para la confirmación de registro
const emailTemplate =
    `<div>
        <h1>Bienvenido!</h1>
        <p>Puedes comenzar a utilizar nuestros servicios</p>
        <a href="http://localhost:8080/">Explorar</a>
    </div>`;

// Plantilla de correo electrónico para la confirmación de tickets
const ticketTemplate =
    `<div>
        <h1>Bienvenido!</h1>
        <p>Puedes comenzar a utilizar nuestros servicio</p>
        <a href="http://localhost:8080/">Explorar</a>
    </div>`;

// Función para enviar un correo de confirmación de registro
const registerConfirmation = async (to_email) => {
    let result = await transporter.sendMail({
        from: ecommerceName,
        to: to_email,
        subject: "Registro exitoso.!",
        html: emailTemplate
    });
    return result;
};

// Función para enviar un correo de confirmación de ticket
const ticketConfirmation = async (to_email, emailMessage) => {
    let result = await transporter.sendMail({
        from: ecommerceName,
        to: to_email,
        subject: "Ticket confirmado",
        text: emailMessage
    });
    return result;
};

// Exporto las funciones de confirmación de registro y ticket para su uso en otras partes de la aplicación
export { registerConfirmation, ticketConfirmation };