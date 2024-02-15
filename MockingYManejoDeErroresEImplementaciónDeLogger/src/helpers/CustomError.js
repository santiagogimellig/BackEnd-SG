export class CustomError {
    // Método estático para crear un nuevo error personalizado
    static createError({ name = 'Error', cause, message, code = 1 }) {
        // Se crea una nueva instancia de Error con el mensaje proporcionado
        const error = new Error(message);
        // Se establecen las propiedades personalizadas del error
        error.name = name; // Nombre del error
        error.cause = cause; // Causa del error
        error.code = code; // Código del error
        // Se lanza el error
        throw error;
    }
}
