// Defino una clase UserDTO que se utiliza para representar un objeto de usuario (DTO: Data Transfer Object)
export default class UserDTO {
    // Constructor de la clase que recibe un objeto de usuario como parámetro
    constructor(user) {
        // Inicializo las propiedades del DTO con los valores del objeto de usuario recibido
        this.id = user._id; // Identificador del usuario
        this.first_name = user.first_name; // Nombre del usuario
        this.last_name = user.last_name; // Apellido del usuario
        this.email = user.email; // Correo electrónico del usuario
        this.rol = user.rol; // Rol del usuario (por ejemplo, admin, cliente)
        this.cartId = user.cartId; // Identificador del carrito asociado al usuario
    }
}