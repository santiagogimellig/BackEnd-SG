import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import multer from "multer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from "passport";
import UsersService from "../services/users.services.js";
import config from "../config.js";

// Obtengo el nombre del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Defino el directorio de utilidades
const srcDir = dirname(__dirname);
const utilsDir = path.join(srcDir, 'utils');

// Exporto las variables __filename, __dirname y utilsDir para su uso externo
export { __filename, __dirname, utilsDir };
// Función para generar un nuevo ID único
export const getNewId = () => uuidv4();

// Función asincrónica para verificar si un archivo existe
const existFile = async (path) => {
    try {
        await fs.promises.access(path);
        return true;
    } catch (error) {
        return false;
    }
};

// Función asincrónica para obtener el contenido JSON de un archivo
export const getJSONFromFile = async (path) => {
    // Verifica si el archivo existe
    if (!(await existFile(path))) {
        return [];
    }
    let content;
    try {
        // Lee el contenido del archivo
        content = await fs.promises.readFile(path, "utf-8");
    } catch (error) {
        // Maneja errores de lectura
        throw new Error(`El archivo ${path} no pudo ser leído.`);
    }
    try {
        // Parsea el contenido como JSON y lo devuelve
        return JSON.parse(content);
    } catch (error) {
        // Maneja errores de formato JSON inválido
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
};

// Función asincrónica para guardar datos JSON en un archivo
export const saveJSONToFile = async (path, data) => {
    // Convierte los datos a formato JSON
    const content = JSON.stringify(data, null, "\t");
    try {
        // Escribe los datos en el archivo
        await fs.promises.writeFile(path, content, "utf-8");
    } catch (error) {
        // Maneja errores de escritura
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
};

// Clase para manejar excepciones personalizadas
export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

// Función para crear un hash de una contraseña
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

// Función para verificar si una contraseña es válida
export const isValidPassword = (plainPasswordFromLogin, user) => {
    return bcrypt.compareSync(plainPasswordFromLogin, user.password)
}

// Configuración de almacenamiento de archivos para multer
const storage = multer.diskStorage({
    destination: './public/productImages',
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único basado en la fecha actual y el nombre original del archivo
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename.replace(/\\/g, "/"));
    }
});

// Middleware de multer para cargar archivos
export const uploader = multer({ storage })

// Configuración del secreto JWT
const JWT_SECRET = config.jwtSecret;

// Función para generar un token JWT
export const tokenGenerator = (user) => {
    const { _id, first_name, last_name, email } = user
    const payload = {
        id: _id,
        first_name,
        last_name,
        email
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' })
    return token;
}

// Función para verificar un token JWT
export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error);
            }
            resolve(payload)
        })
    })
}

// Middleware para autenticación JWT
export const jwtAuth = (req, res, next) => {
    const { authorization: token } = req.headers;
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' })
    }
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(403).json({ message: 'no authorized' })
        }
        req.user = await UsersService.findById(payload.id)
        next();
    })
}

// Middleware para autenticación con Passport
export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() })
        }
        req.user = user;
        next();
    })(req, res, next)
}

// Middleware de autorización basado en roles
export const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { rol: userRole } = req.user;
    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
