// Definición de la clase UserDTO
export default class UserDTO {
    // Constructor que recibe un objeto de usuario como parámetro
    constructor(user) {
        // Asigna los valores del usuario proporcionado a las propiedades del DTO
        this.id = user._id; // ID del usuario
        this.first_name = user.first_name; // Nombre del usuario
        this.last_name = user.last_name; // Apellido del usuario
        this.email = user.email; // Correo electrónico del usuario
        this.rol = user.rol; // Rol del usuario
        this.cartId = user.cartId; // ID del carrito asociado al usuario
    }
}
