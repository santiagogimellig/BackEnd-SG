import UserDTO from "../dto/user.dto.js"

export default class User {
    constructor(dao) {
        this.dao = dao;
    }

    // Método para obtener usuarios con un filtro opcional
    async get(filter = {}) {
        const users = await this.dao.get(filter)
        return users
    }

    // Método para crear un nuevo usuario
    create(data) {
        return this.dao.create(data)
    }

    // Método para actualizar un usuario por su ID
    updateById(id, data) {
        return this.dao.updateById(id, data)
    }

    // Método para eliminar un usuario por su ID
    deleteById(id) {
        return this.dao.deleteById(id)
    }

    // Método para obtener un usuario por su ID
    getById(id) {
        return this.dao.getById(id)
    }

    // Método para obtener el usuario actual y convertirlo en un objeto DTO
    async getCurrent(id) {
        let currentUser = await this.dao.getById(id);
        // Si no se encuentra el usuario, se devuelve un mensaje de error
        if (!currentUser) {
            return { error: "Usuario no encontrado" };
        }
        // Se instancia un nuevo objeto UserDTO con los datos del usuario actual
        currentUser = new UserDTO(currentUser);
        // Se devuelve un objeto con los campos específicos del usuario actual
        return {
            id: currentUser.id.toString(),
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            email: currentUser.email,
            rol: currentUser.rol,
            cartId: currentUser.cartId
        };
    }
}
