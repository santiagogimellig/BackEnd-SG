// Importo la configuración de persistencia desde el archivo config.js.
import config from "../config.js";

// Declaro las variables ProductDao y UserDao para su exportación posterior.
export let ProductDao;
export let UserDao;

// Utilizo una estructura de control switch para seleccionar la implementación correcta según la configuración de persistencia.
switch (config.persistence) {
    // Si la configuración de persistencia es 'mongodb', importo la implementación de UserDao y ProductDao para MongoDB.
    case 'mongodb':
        UserDao = (await import('./user.dao.js')).default; // Importo UserDao para MongoDB.
        ProductDao = (await import('./product.dao.js')).default; // Importo ProductDao para MongoDB.
        break;

    // Si la configuración de persistencia es 'file', importo la implementación de UserDao para MongoDB y ProductDao para archivos.
    case 'file':
        UserDao = (await import('./user.dao.js')).default; // Importo UserDao para MongoDB.
        ProductDao = (await import('./product.dao.file.js')).default; // Importo ProductDao para archivos.
        break;

    // Si la configuración de persistencia no coincide con 'mongodb' ni 'file', se utilizará la implementación por defecto para ambas.
    default:
        UserDao = (await import('./user.dao.js')).default; // Importo UserDao por defecto.
        ProductDao = (await import('./product.dao.js')).default; // Importo ProductDao por defecto.
        break;
}