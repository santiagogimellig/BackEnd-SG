import { Router } from 'express';
import { verifyToken } from '../../helpers/utils.js';

// Se crea una nueva instancia de Router
const router = Router();

// Ruta para mostrar el perfil del usuario, protegida con el middleware verifyToken para asegurar que el usuario esté autenticado
router.get('/profile', verifyToken, (req, res) => {
    // Se renderiza la vista del perfil, pasando el título y los datos del usuario obtenidos del middleware de autenticación
    res.render('profile', { title: 'Perfil', user: req.user });
});

// Ruta para mostrar la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Ruta para mostrar la página de registro de usuarios
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Ruta para mostrar la página de recuperación de contraseña
router.get('/password-recovery', (req, res) => {
    res.render('password-recovery', { title: "Recuperar password" })
})

// Ruta de inicio que devuelve un mensaje simple de saludo
router.get('/', (req, res) => {
    res.send('<h1>Hello People!</h1>');
});

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router;
