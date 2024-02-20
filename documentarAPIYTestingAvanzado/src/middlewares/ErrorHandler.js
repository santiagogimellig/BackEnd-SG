import EnumsError from "../helpers/EnumsError.js"; // Importa el módulo que contiene los códigos de error enumerados

export default (error, req, res, next) => {
    console.error(error.cause); // Imprime la causa del error en la consola

    // Manejo de errores basado en el código de error
    switch (error.code) {
        case EnumsError.BAD_REQUEST_ERROR: // Si el código de error es de solicitud incorrecta
        case EnumsError.INVALID_PARAMS_ERROR: // o de parámetros inválidos
            res.status(400).json({ status: 'error', message: error.message }); // Devuelve un estado 400 (Solicitud incorrecta) con el mensaje de error
            break;
        case EnumsError.DATA_BASE_ERROR: // Si el código de error es de error de base de datos
        case EnumsError.ROUTING_ERROR: // o de error de enrutamiento
            res.status(500).json({ status: 'error', message: error.message }); // Devuelve un estado 500 (Error interno del servidor) con el mensaje de error
            break;
        default:
            res.status(500).json({ status: 'error', message: 'Error desconocido' }); // Si el código de error no está definido, devuelve un estado 500 con un mensaje genérico de error
            break;
    }
}