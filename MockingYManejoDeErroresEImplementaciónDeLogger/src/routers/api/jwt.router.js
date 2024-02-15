import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import AuthController from '../../controllers/auth.controller.js';
import { userRepository } from '../../repositories/index.js';
import passport from 'passport';
import { createHash, isValidPassword, jwtAuth, tokenGenerator, verifyToken, authMiddleware } from '../../helpers/utils.js';

// Se crea una nueva instancia de Router
const router = Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res, next) => {
    // Se extraen las credenciales de la solicitud
    const { email, password } = req.body;
    try {
        // Se busca el usuario por su correo electrónico en la base de datos
        const user = await UsersController.get({ email });
        // Si no se encuentra ningún usuario con el correo electrónico dado, se devuelve un error de inicio de sesión
        if (user.length === 0) {
            req.logger.warning(`Correo o password invalidos`);
            return res.status(401).json({ message: "Correo o password invalidos" });
        }
        // Se valida la contraseña proporcionada con la almacenada en la base de datos
        const isPassValid = isValidPassword(password, user[0]);
        // Si la contraseña no coincide, se devuelve un error de inicio de sesión
        if (!isPassValid) {
            req.logger.warning(`Correo o password invalidos`);
            return res.status(401).json({ message: "Correo o password invalidos" });
        }
        // Se genera un token de autenticación utilizando la función tokenGenerator
        const token = tokenGenerator(user[0]);
        // Se establece la cookie de acceso con el token generado
        res.cookie('access_token', token, { maxAge: 1000 * 60 * 60, httpOnly: true });
        // Se redirige al usuario a la página de productos
        res.status(200).redirect('/products');
    } catch (error) {
        console.log(`Error ${error.message}`);
        next(error);
    }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res, next) => {
    try {
        // Se obtienen los datos del cuerpo de la solicitud
        const { body } = req;
        // Se crea un nuevo usuario utilizando el controlador de autenticación y se encripta la contraseña
        const newUser = await AuthController.register({
            ...body,
            password: createHash(req.body.password)
        });
        // Se registra el nuevo usuario y se devuelve una respuesta exitosa
        req.logger.info(`Nuevo Usuario ${newUser}`);
        return res.status(200).json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
        req.logger.error(error.message);
        next(error);
    }
});

// Ruta para obtener el usuario actual
router.get('/current', authMiddleware('jwt'), async (req, res) => {
    try {
        // Se obtiene el usuario actual utilizando el repositorio de usuarios
        const user = await userRepository.getCurrent(req.user.id);
        // Se devuelve el usuario en formato JSON
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener el carrito del usuario actual
router.get('/cart', authMiddleware('jwt'), async (req, res) => {
    try {
        console.log("entra a estrategia current");
        console.log("req.user", req.user);
        // Se devuelve el usuario actual con su carrito en formato JSON
        res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todos los usuarios (solo para pruebas)
router.get('/users', async (req, res, next) => {
    try {
        // Se obtienen todos los usuarios utilizando el controlador de usuarios
        const users = await UsersController.get();
        // Se devuelve la lista de usuarios en formato JSON
        res.status(200).json(users);
    } catch (error) {
        console.error("Error", error.message);
        next(error);
    }
});

// Ruta para solicitar la recuperación de contraseña
router.post('/password-recovery', async (req, res, next) => {
    const { email, newPassword } = req.body;
    try {
        // Se busca el usuario por su correo electrónico en la base de datos
        const user = await UsersController.get({ email });
        // Si no se encuentra ningún usuario con el correo electrónico dado, se devuelve un error
        if (!user) {
            return res.status(401).json({ message: "Correo o password invalidos" });
        }
        // Se restablece la contraseña del usuario utilizando el controlador de autenticación
        const updatedUser = await AuthController.resetPassword({ email, newPassword });
        // Se devuelve una respuesta exitosa
        return res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router;
