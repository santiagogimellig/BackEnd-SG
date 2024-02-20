import UserDTO from "../dto/user.dto.js"; // Importa la clase UserDTO para mapear usuarios a DTO

export default class User {
    constructor(dao) {
        this.dao = dao; // Inicializa el DAO recibido como parámetro en el constructor
    }

    async get(filter = {}) {
        const users = await this.dao.get(filter); // Obtiene usuarios utilizando el método get del DAO
        return users; // Devuelve los usuarios obtenidos
    }

    create(data) {
        return this.dao.create(data); // Crea un nuevo usuario utilizando el método create del DAO
    }

    updateById(id, data) {
        return this.dao.updateById(id, data); // Actualiza un usuario por su ID utilizando el método updateById del DAO
    }

    deleteById(id) {
        return this.dao.deleteById(id); // Elimina un usuario por su ID utilizando el método deleteById del DAO
    }

    getById(id) {
        return this.dao.getById(id); // Obtiene un usuario por su ID utilizando el método getById del DAO
    }

    async getCurrent(id) {
        let currentUser = await this.dao.getById(id); // Obtiene el usuario actual por su ID utilizando el método getById del DAO
        if (!currentUser) {
            return { error: "Usuario no encontrado" }; // Devuelve un mensaje de error si el usuario no existe
        }
        currentUser = new UserDTO(currentUser); // Convierte el usuario a un DTO utilizando la clase UserDTO
        return {
            id: currentUser.id.toString(), // Convierte el ID a una cadena y lo asigna como propiedad "id"
            firstName: currentUser.first_name, // Asigna el nombre de pila del usuario como propiedad "firstName"
            lastName: currentUser.last_name, // Asigna el apellido del usuario como propiedad "lastName"
            email: currentUser.email, // Asigna el correo electrónico del usuario como propiedad "email"
            rol: currentUser.rol, // Asigna el rol del usuario como propiedad "rol"
            cartId: currentUser.cartId // Asigna el ID del carrito del usuario como propiedad "cartId"
        };
    }
}