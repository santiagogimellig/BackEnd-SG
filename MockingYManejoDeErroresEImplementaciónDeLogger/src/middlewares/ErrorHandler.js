import EnumsError from "../helpers/EnumsError.js";

// Middleware para manejar errores
export default (error, req, res, next) => {
    // Registra el error en la consola
    console.error(error.cause);
    // Maneja diferentes códigos de error y envía una respuesta adecuada
    switch (error.code) {
        case EnumsError.BAD_REQUEST_ERROR:
        case EnumsError.INVALID_PARAMS_ERROR:
            // Error de solicitud incorrecta o parámetros inválidos
            res.status(400).json({ status: 'error', message: error.message });
            break;

        case EnumsError.DATA_BASE_ERROR:
        case EnumsError.ROUTING_ERROR:
            // Error de base de datos o error de enrutamiento
            res.status(500).json({ status: 'error', message: error.message });
            break;

        default:
            // Error desconocido
            res.status(500).json({ status: 'error', message: 'Error desconocido' });
            break;
    }
}