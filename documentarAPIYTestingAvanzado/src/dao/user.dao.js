// Importo el modelo de usuario desde su archivo correspondiente
import UserModel from "../models/user.model.js";

// Defino una clase UserDao que proporciona métodos para interactuar con la base de datos de usuarios
export default class UserDao {

    // Método "get" que recupera una lista de usuarios que coinciden con los criterios de búsqueda proporcionados
    // Los criterios de búsqueda se pueden especificar como un objeto que contiene condiciones de búsqueda
    get(criteria = {}) {
        return UserModel.find(criteria);
    }

    // Método "create" que crea un nuevo usuario utilizando los datos proporcionados y lo guarda en la base de datos
    create(data) {
        return UserModel.create(data);
    }

    // Método "getById" que busca un usuario por su ID en la base de datos y devuelve el usuario encontrado
    getById(uid) {
        return UserModel.findById(uid);
    }

    // Método "updateById" que actualiza un usuario existente en la base de datos utilizando su ID y los nuevos datos proporcionados
    updateById(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }

    // Método "deleteById" que elimina un usuario de la base de datos utilizando su ID
    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid });
    }
}
