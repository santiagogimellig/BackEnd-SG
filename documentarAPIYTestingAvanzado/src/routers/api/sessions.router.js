import { Router } from 'express'; // Importar el enrutador de Express
import 'dotenv/config'; // Importar configuración del entorno
import UserManager from '../../dao/UserManager.js'; // Importar el gestor de usuarios
import { createHash, isValidPassword } from '../../helpers/utils.js'; // Importar funciones de utilidad para manejo de contraseñas
import passport from 'passport'; // Importar Passport.js para autenticación

const router = Router(); // Crear un nuevo enrutador

// Ruta para registrar un nuevo usuario
router.post('/sessions/register', async (req, res) => {
    const { body } = req; // Obtener cuerpo de la solicitud
    // Crear un nuevo usuario con contraseña encriptada
    const newUser = await UserManager.create({
        ...body,
        password: createHash(body.password) // Encriptar la contraseña antes de almacenarla en la base de datos
    });
    console.log('newUser', newUser); // Imprimir el nuevo usuario creado en la consola
    res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión
});

// Ruta para iniciar sesión
router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user; // Almacenar la información del usuario en la sesión
    res.redirect('/products'); // Redirigir al usuario a la página de productos después de iniciar sesión con éxito
});

// Ruta de inicio de sesión con GitHub
router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de retorno de inicio de sesión con GitHub
router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user; // Almacenar la información del usuario en la sesión
    res.redirect('/products'); // Redirigir al usuario a la página de productos después de iniciar sesión con GitHub
});

// Ruta para recuperar contraseña
router.post('/sessions/password-recovery', async (req, res) => {
    const { email, newPassword } = req.body; // Obtener email y nueva contraseña de la solicitud
    const user = await UserManager.getByMail(email); // Obtener usuario por email
    if (!user) { // Verificar si el usuario existe
        return res.status(401).send('Correo o contraseña inválidos.'); // Devolver error si el usuario no existe
    }
    try {
        const updatedUser = await UserManager.update(email, newPassword); // Actualizar contraseña del usuario
        if (updatedUser) {
            res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión después de actualizar la contraseña
        } else {
            res.status(500).json({ message: "Error al actualizar el usuario" }); // Devolver error si falla la actualización del usuario
        }
    } catch (error) {
        console.log('Error', error.message); // Manejar error
        res.status(500).json({ message: "Error al actualizar el usuario" }); // Devolver error si falla la actualización del usuario
    }
});

// Ruta para cerrar sesión
router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => { // Destruir la sesión del usuario
        res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
    });
});

export default router; // Exportar el enrutador