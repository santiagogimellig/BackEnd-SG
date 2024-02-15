import { Router } from 'express';
import UsersService from '../../services/users.services';
import UsersController from '../../controllers/users.controller';
import { authMiddleware, isValidPassword, tokenGenerator } from '../../helpers/utils.js'

// Se crea una nueva instancia de Router
const router = Router();

// Ruta para la autenticación de usuarios
router.post('/auth/login', async (req, res) => {
    // Se obtienen los datos de correo electrónico y contraseña del cuerpo de la solicitud
    const { email, password } = req.body;
    // Se busca el usuario por su correo electrónico
    const user = await UsersController.getByMail(email);
    // Si no se encuentra el usuario, se devuelve un mensaje de error
    if (!user) {
        return res.status(401).json({ message: 'Email o contraseña inválidos.' });
    }
    // Se verifica si la contraseña proporcionada coincide con la del usuario
    const isValidPass = isValidPassword(password, user);
    // Si la contraseña no es válida, se devuelve un mensaje de error
    if (!isValidPass) {
        return res.status(401).json({ message: 'Email o contraseña inválidos.' });
    }
    // Se genera un token de autenticación para el usuario
    const token = tokenGenerator(user);
    // Se establece la cookie de acceso con el token generado
    res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60, // Duración de la cookie: 1 hora
        httpOnly: true, // La cookie solo es accesible a través de HTTP
        signed: true // La cookie está firmada
    })
    // Se redirige al usuario a la página de productos después de iniciar sesión exitosamente
    .status(200)
    .redirect('/product');
})

// Ruta para obtener los datos del usuario actual
router.get('/current', authMiddleware('jwt'), (req, res) => {
    // Se devuelve el usuario actual obtenido del middleware de autenticación
    res.status(200).json(req.user)
})

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router;
