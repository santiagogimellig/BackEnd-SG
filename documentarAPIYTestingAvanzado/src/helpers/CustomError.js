// Clase CustomError: Define un método estático para crear errores personalizados
export class CustomError {
    // Método estático createError: Crea un nuevo error personalizado con los parámetros especificados
    static createError({ name = 'Error', cause, message, code = 1 }) {
        // Crea una nueva instancia de Error con el mensaje proporcionado
        const error = new Error(message);
        // Establece el nombre del error
        error.name = name;
        // Establece la causa del error
        error.cause = cause;
        // Establece el código del error
        error.code = code;
        // Lanza el error
        throw error;
    }
}
