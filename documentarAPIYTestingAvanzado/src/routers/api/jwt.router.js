import { Router } from 'express'; // Importar el enrutador de Express
import UsersController from '../../controllers/users.controller.js'; // Importar el controlador de usuarios
import AuthController from '../../controllers/auth.controller.js'; // Importar el controlador de autenticación
import { userRepository } from '../../repositories/index.js'; // Importar el repositorio de usuarios
import { createHash, isValidPassword, jwtAuth, tokenGenerator, verifyToken, authMiddleware, authorizationMiddleware } from '../../helpers/utils.js'; // Importar funciones y middleware útiles
import passport from 'passport'; // Importar Passport.js para autenticación
import AuthServices from '../../services/auth.services.js'; // Importar servicios de autenticación
import UsersService from '../../services/users.services.js'; // Importar servicios de usuarios

const router = Router(); // Crear un nuevo enrutador

// Ruta para iniciar sesión de usuario
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body; // Obtener email y contraseña del cuerpo de la solicitud
    try {
        const user = await UsersController.get({ email }); // Obtener usuario por email
        if (user.length === 0) { // Si no se encuentra el usuario
            req.logger.warning(`Correo o password invalidos`); // Registrar advertencia
            return res.status(401).json({ message: "Correo o password invalidos" }); // Devolver error de credenciales inválidas
        }
        const isPassValid = isValidPassword(password, user[0]); // Verificar si la contraseña es válida
        if (!isPassValid) { // Si la contraseña no es válida
            req.logger.warning(`Correo o password invalidos`); // Registrar advertencia
            return res.status(401).json({ message: "Correo o password invalidos" }); // Devolver error de credenciales inválidas
        }
        const token = tokenGenerator(user[0], 'login'); // Generar token JWT
        // Establecer la cookie de acceso con el token JWT y redirigir al usuario a la página de productos
        res.cookie('access_token', token, { maxAge: 1000 * 60 * 60, httpOnly: true }).status(200).redirect('/products');
    } catch (error) {
        console.log(`Error ${error.message}`); // Manejar error
        next(error);
    }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res, next) => {
    try {
        const { body } = req; // Obtener cuerpo de la solicitud
        const newUserToken = await AuthController.register({ // Registrar nuevo usuario
            ...body,
            password: createHash(req.body.password) // Encriptar contraseña
        });
        return res.status(200).json({ status: 'success', message: 'User registered successfully', payload: newUserToken }); // Devolver éxito y token de usuario registrado
    } catch (error) {
        req.logger.error(error.message); // Manejar error
        next(error);
    }
});

// Ruta para obtener el usuario actual
router.get('/current', authMiddleware('jwt'), async (req, res) => {
    try {
        const user = await userRepository.getCurrent(req.user.id); // Obtener usuario actual
        res.status(200).json(user); // Devolver usuario en formato JSON
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Manejar error
    }
});

// Ruta para obtener el carrito del usuario actual
router.get('/cart', authMiddleware('jwt'), async (req, res) => {
    try {
        console.log("entra a estrategia current"); // Registrar mensaje de depuración
        console.log("req.user", req.user); // Registrar información del usuario actual
        res.status(200).json(req.user); // Devolver información del usuario en formato JSON
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Manejar error
    }
});

// Ruta para obtener todos los usuarios
router.get('/users', async (req, res, next) => {
    try {
        const users = await UsersController.get(); // Obtener todos los usuarios
        res.status(200).json(users); // Devolver usuarios en formato JSON
    } catch (error) {
        console.error("Error", error.message); // Manejar error
        next(error);
    }
});

// Ruta para manejar la recuperación de contraseña por correo electrónico
router.get('/pass-recovery-by-mail/:token', async (req, res, next) => {
    const { token } = req.params; // Obtener token de la URL
    try {
        const { exp, email } = await verifyToken(token); // Verificar token
        const currentTime = Math.floor(Date.now() / 1000); // Obtener tiempo actual
        const data = { email }; // Crear objeto de datos para el renderizado
        if (exp && exp < currentTime) { // Si el token ha expirado
            res.redirect('/pass-recovery'); // Redirigir a página de recuperación de contraseña
        } else {
            res.render('pass-recovery-by-mail', data); // Renderizar página de recuperación de contraseña por correo electrónico
        }
    } catch (error) {
        res.redirect('/pass-recovery'); // Redirigir a página de recuperación de contraseña en caso de error
        console.log(error.message); // Manejar error
        next(error);
    }
});

// Ruta para restaurar la contraseña
router.post('/pass-restore', async (req, res) => {
    const { email } = req.body; // Obtener email de la solicitud
    return res.status(200).json({ message: email }); // Devolver mensaje con el email
});

// Ruta para restablecer la contraseña
router.post('/password-restore/:email', async (req, res, next) => {
    const { pass, repeated_pass } = req.body; // Obtener contraseña y repetir contraseña de la solicitud
    const { email } = req.params; // Obtener email de la URL
    try {
        if (pass === repeated_pass) { // Verificar si las contraseñas coinciden
            const user = await UsersController.getByMail(email); // Obtener usuario por email
            if (!isValidPassword(pass, user)) { // Verificar si la nueva contraseña es diferente a la anterior
                const user = await UsersService.findAll({ email }); // Obtener usuario por email
                await UsersService.updateById(user[0]._id, { password: createHash(pass) }); // Actualizar contraseña del usuario
                return res.status(201).send('Clave actualizada'); // Devolver mensaje de éxito
            }
            res.status(400).json({ error: `La clave no puede ser igual a la anterior` }); // Devolver error si las contraseñas son iguales
        } else {
            res.status(400).json({ error: 'Las claves deben ser iguales' }); // Devolver error si las contraseñas no coinciden
        }
    } catch (error) {
        console.log(error.message); // Manejar error
        next(error);
    }
});

// Ruta para manejar la recuperación de contraseña por correo electrónico
router.post('/pass-recovery-by-mail', async (req, res, next) => {
    const { email } = req.body; // Obtener email de la solicitud
    try {
        const user = await UsersController.get({ email }); // Obtener usuario por email
        if (user.length > 0) { // Si se encuentra el usuario
            const token = tokenGenerator(user[0], 'recovery'); // Generar token de recuperación de contraseña
            await AuthServices.passwordRestore(user[0].email, token); // Restaurar contraseña del usuario
            return res.status(200).json({ message: `Mail enviado, revise su casilla de correo: ${email} que contiene un link para restaurar su clave` }); // Devolver mensaje de éxito
        }
        res.status(404).json({ message: "Usuario no encontrado" }); // Devolver error si no se encuentra el usuario
    } catch (error) {
        console.log('error', error.message); // Manejar error
        next(error);
    }
});

// Ruta para manejar la recuperación de contraseña por correo electrónico
router.get('/pass-recovery-by-mail', async (req, res, next) => {
    const { email } = req.body; // Obtener email de la solicitud
    try {
        const user = await UsersController.get({ email }); // Obtener usuario por email
        if (user.length > 0) { // Si se encuentra el usuario
            const token = tokenGenerator(user[0], 'recovery'); // Generar token de recuperación de contraseña
            res.cookie('access_token', token, { maxAge: 1000 * 30, httpOnly: true }); // Establecer cookie de acceso con el token
            await AuthServices.passwordRestore(token); // Restaurar contraseña del usuario
            return res.status(200).json({ token }); // Devolver token en formato JSON
        }
        res.status(404).json({ message: "Usuario no encontrado" }); // Devolver error si no se encuentra el usuario
    } catch (error) {
        console.log('error', error.message); // Manejar error
        next(error);
    }
});

// Ruta para manejar la recuperación de contraseña
router.post('/password-recovery', async (req, res, next) => {
    const { email, newPassword } = req.body; // Obtener email y nueva contraseña de la solicitud
    try {
        const user = await UsersController.get({ email }); // Obtener usuario por email
        if (!user) { // Si no se encuentra el usuario
            return res.status(401).json({ message: "Correo o password invalidos" }); // Devolver error de credenciales inválidas
        }
        const updatedUser = await AuthController.resetPassword({ email, newPassword }); // Restablecer contraseña
        return res.status(204).end(); // Devolver respuesta vacía con código de éxito
    } catch (error) {
        next(error); // Manejar error
    }
});

export default router; // Exportar el enrutador