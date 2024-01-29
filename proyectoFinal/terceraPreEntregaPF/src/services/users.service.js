// Importo el repositorio de usuarios
import { UsersRepository } from "../repository/users.repository.js";

// Clase que proporciona servicios relacionados con la gestión de usuarios
class UsersService {
    // Obtiene información pública de un usuario
    async getPublicUser(user) {
        // Creo una instancia del repositorio de usuarios
        let usersRepository = new UsersRepository();
        // Utilizo el repositorio para obtener la información pública del usuario
        return usersRepository.getPublicUser(user);
    }
}

// Exporto una instancia de la clase como servicio de usuarios
const usersService = new UsersService();
export default usersService;