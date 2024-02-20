// Importa el módulo Router de Express
import { Router } from 'express';

// Importa la función de verificación de token desde el archivo de utilidades
import { verifyToken } from '../../helpers/utils.js';

// Crea una instancia de Router
const router = Router();

// Ruta para el perfil del usuario, solo accesible si el token es válido
router.get('/profile', verifyToken, (req, res) => {
    res.render('profile', { title: 'Perfil', user: req.user });
});

// Ruta para la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Ruta para la página de recuperación de contraseña
router.get('/password-recovery', (req, res) => {
    res.render('password-recovery', { title: "Recuperar password" })
});

// Ruta para la página de recuperación de contraseña por correo electrónico
router.get('/pass-recovery-by-mail', (req, res) => {
    res.render('pass-recovery-by-mail', { title: "Recuperar password" })
});

// Ruta para la página de recuperación de contraseña por correo electrónico
router.get('/pass-recovery', (req, res) => {
    res.render('pass-recovery', { title: "Ingrese email" })
});

// Ruta de ejemplo
router.get('/hello', (req, res) => {
    res.send('<h1>Hello People!</h1>');
});

// Exporta el enrutador para su uso en otras partes de la aplicación
export default router;