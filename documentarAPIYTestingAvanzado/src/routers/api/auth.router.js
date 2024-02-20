import { Router } from 'express'; // Importa el enrutador de Express
import UsersService from '../../services/users.services'; // Importa el servicio de usuarios
import UsersController from '../../controllers/users.controller'; // Importa el controlador de usuarios
import { authMiddleware, isValidPassword, tokenGenerator } from '../../helpers/utils.js'; // Importa middlewares y funciones de utilidad
const router = Router(); // Crea un nuevo enrutador de Express

// Ruta para autenticación de usuario
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body; // Obtiene el correo electrónico y la contraseña del cuerpo de la solicitud
    const user = await UsersController.getByMail(email); // Busca al usuario por correo electrónico en la base de datos
    if (!user) { // Si el usuario no existe, devuelve un error de autenticación
        return res.status(401).json({ message: 'Email o pass invalidos.' });
    }
    const isValidPass = isValidPassword(password, user); // Verifica si la contraseña es válida
    if (!isValidPass) { // Si la contraseña no es válida, devuelve un error de autenticación
        return res.status(401).json({ message: 'Email o pass invalidos.' });
    }
    const token = tokenGenerator(user); // Genera un token de acceso para el usuario autenticado
    // Establece el token de acceso en una cookie y redirige al usuario a la página de productos
    res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60, // Tiempo de vida de la cookie (1 hora)
        httpOnly: true, // La cookie solo es accesible a través de HTTP
        signed: true // La cookie está firmada
    })
        .status(200)
        .redirect('/product');
});

// Ruta para obtener información del usuario actual
router.get('/current', authMiddleware('jwt'), (req, res) => {
    res.status(200).json(req.user); // Devuelve la información del usuario actual en formato JSON
});

export default router; // Exporta el enrutador