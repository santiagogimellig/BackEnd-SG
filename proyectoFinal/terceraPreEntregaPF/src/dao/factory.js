// Importo las opciones de configuración desde el archivo correspondiente
import { options } from "../config/config.js";

// Obtengo la opción de persistencia del servidor desde la configuración
const persistence = options.server.persistence;

// Declaro una variable para el DAO de usuarios
let usersDao;

// Selecciono y configuro el DAO según la opción de persistencia
switch (persistence) {
    case "mongo":
        // En caso de persistencia MongoDB
        // Importo las funciones necesarias para la conexión a la base de datos
        const { connectDB } = await import("../config/dbConnection.js");
        // Conecto a la base de datos MongoDB
        connectDB();
        // Importo el DAO específico para MongoDB
        const { UsersMongo } = await import("./managers/mongo/users.mongo.js")
        // Instancio el DAO de usuarios para MongoDB
        usersDao = new UsersMongo();
        break;
    case "memory":
        // En caso de persistencia en memoria
        // Importo el DAO específico para memoria
        const { UsersMemory } = await import("./managers/memory/users.memory.js")
        // Instancio el DAO de usuarios para memoria
        usersDao = new UsersMemory()
        break;
    case "sql":
        // En caso de persistencia SQL (aún no implementado)
        break;
}

// Exporto el DAO de usuarios seleccionado y configurado
export { usersDao };