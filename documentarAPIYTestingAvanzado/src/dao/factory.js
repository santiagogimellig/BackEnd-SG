// Importo el módulo de configuración desde el archivo config.js
import config from "../config.js";
// Declaro las variables ProductDao y UserDao para la exportación
export let ProductDao;
export let UserDao;

// Switch statement para determinar qué DAO utilizar según la configuración de persistencia
switch (config.persistence) {
    case 'mongodb':
        // Si la persistencia es mongodb, importo y asigno el DAO de usuario y producto de MongoDB
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.js')).default
        break;
    case 'file':
        // Si la persistencia es file, importo y asigno el DAO de usuario de la base de datos y el DAO de producto de archivos
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.file.js')).default
        break;
    default:
        // Si no se especifica una opción válida de persistencia, utilizo los DAO de usuario y producto predeterminados
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.js')).default
        break;
}