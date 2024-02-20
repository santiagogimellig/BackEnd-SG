// Función generatorProductError: Genera un mensaje de error detallado para los campos de un producto que faltan o son inválidos
export const generatorProductError = (product) => {
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

// Función generatorUserIdError: Genera un mensaje de error para un identificador de usuario inválido
export const generatorUserIdError = (id) => {
    return `Se debe enviar un identificador válido.
    Valor recibido: ${id}`;
}