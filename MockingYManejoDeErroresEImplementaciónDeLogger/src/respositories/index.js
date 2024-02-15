import UserRepository from './user.repository.js'
import { UserDao } from '../dao/factory.js'

// Se instancia un nuevo UserDao utilizando el factory
const newUserDao = new UserDao()

// Se crea una nueva instancia de UserRepository utilizando el UserDao recién creado
export const userRepository = new UserRepository(newUserDao);
