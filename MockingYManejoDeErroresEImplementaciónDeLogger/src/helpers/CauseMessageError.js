// Función para generar un mensaje de error relacionado con los campos de un producto
export const generatorProductError = (product) => {
    // Retorna un mensaje de error detallado sobre los campos del producto recibido
    return `Todos los campos son requeridos y deben ser válidos.
    Lista de campos recibidos en la solicitud:
        - title         : ${product.title}
        - description   : ${product.description}
        - code          : ${product.code}
        - price         : ${product.price}
        - stock         : ${product.stock}
        - category      : ${product.category}
        `;
};

// Función para generar un mensaje de error relacionado con el ID de un usuario
export const generatorUserIdError = (id) => {
    // Retorna un mensaje de error indicando que se debe enviar un identificador válido
    return `Se debe enviar un identificador válido.
    Valor recibido: ${id}`;
};
