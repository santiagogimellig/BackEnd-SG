// Importo el modelo de usuario desde el archivo user.model.js
import UserModel from "../models/user.model.js";

// Defino una clase llamada UserDao para manejar operaciones de acceso a datos relacionadas con los usuarios
export default class UserDao {
    // Defino un método para obtener usuarios de la base de datos
    // Puedo proporcionar criterios de búsqueda opcionales
    get(criteria = {}) {
        // Utilizo el método find() del modelo UserModel para buscar usuarios en la base de datos
        // Puedo especificar criterios de búsqueda
        return UserModel.find(criteria);
    }

    // Defino un método para crear un nuevo usuario en la base de datos
    // Necesito proporcionar los datos del nuevo usuario como parámetro
    create(data) {
        // Imprimo los datos recibidos para verificarlos
        console.log("data", data);
        // Utilizo el método create() del modelo UserModel para insertar un nuevo usuario en la base de datos
        // Paso los datos del usuario que deseo crear al método create()
        return UserModel.create(data);
    }

    // Defino un método para obtener un usuario de la base de datos por su ID
    // Necesito proporcionar el ID del usuario que deseo buscar
    getById(uid) {
        // Utilizo el método findById() del modelo UserModel para buscar un usuario por su ID
        // Paso el ID del usuario al método findById()
        return UserModel.findById(uid);
    }

    // Defino un método para actualizar un usuario en la base de datos por su ID
    // Necesito proporcionar el ID del usuario que deseo actualizar y los nuevos datos del usuario
    updateById(uid, data) {
        // Utilizo el método updateOne() del modelo UserModel para actualizar un usuario por su ID
        // Paso un objeto de consulta que busca un usuario por su ID y un objeto de actualización que contiene los nuevos datos del usuario
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }

    // Defino un método para eliminar un usuario de la base de datos por su ID
    // Necesito proporcionar el ID del usuario que deseo eliminar
    deleteById(uid) {
        // Utilizo el método deleteOne() del modelo UserModel para eliminar un usuario por su ID
        // Paso un objeto de consulta que busca un usuario por su ID
        return UserModel.deleteOne({ _id: uid });
    }
}