import UserRepository from './user.repository.js'; // Importa el repositorio de usuarios
import { UserDao } from '../dao/factory.js'; // Importa la clase UserDao del factory de DAO

// Crea una nueva instancia de UserDao
const newUserDao = new UserDao();

// Crea un nuevo repositorio de usuarios utilizando el UserDao creado
export const userRepository = new UserRepository(newUserDao);