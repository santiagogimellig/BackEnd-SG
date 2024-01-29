// Importo la biblioteca Twilio para enviar mensajes de texto (SMS)
import twilio from 'twilio';

// Configuro las credenciales de Twilio y los números de teléfono
const TWILIO_ACCOUNT_SID = "ACbebd888a9370d6815771976b92dd5fd6"
const TWILIO_AUTH_TOKEN = "a6f19e9341d74c3d25b3b54ed00600723"
const TWILIO_SMS_NUMBER = ""
const TEST_NUMBER = "+543424785689"

// Creo un cliente Twilio utilizando las credenciales proporcionadas
const client = await twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Función para enviar mensajes de texto (SMS)
const sendMessage = async (message) => {
    // Utilizo el cliente Twilio para enviar un mensaje con el contenido especificado
    let result = await client.messages.create({
        body: message,
        from: TWILIO_SMS_NUMBER,
        to: TEST_NUMBER
    });

    // Devuelvo el resultado de la operación de envío de mensajes
    return result;
}

// Exporto la función de envío de mensajes para su uso en otras partes de la aplicación
export { sendMessage };