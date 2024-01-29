// Importa la clase `GetPublicUserDto` desde el archivo de DTO (Data Transfer Object) para usuarios.
import { GetPublicUserDto } from "../dao/dto/users.dto.js";

// Clase que actúa como repositorio para operaciones relacionadas con usuarios.
export class UsersRepository {
    // Método para obtener un objeto GetPublicUserDto a partir de un objeto de usuario.
    async getPublicUser(user) {
        // Crea una instancia de la clase GetPublicUserDto, pasando el objeto de usuario como argumento.
        const userDto = new GetPublicUserDto(user);
        // Devuelve la instancia de GetPublicUserDto.
        return userDto;
    }
}