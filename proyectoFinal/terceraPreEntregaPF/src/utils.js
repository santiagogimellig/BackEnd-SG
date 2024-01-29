// Importación de módulos necesarios para manipular rutas y realizar operaciones de cifrado
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

// Función para crear un hash a partir de una contraseña utilizando bcrypt
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar una contraseña comparándola con la contraseña almacenada en un usuario usando bcrypt
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

// Obtención de la ruta del archivo actual (__filename) y su directorio (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Exportación del directorio actual (__dirname) para su uso en otros módulos
export default __dirname;