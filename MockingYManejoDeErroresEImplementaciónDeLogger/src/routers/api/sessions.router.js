import { Router } from 'express';
import 'dotenv/config';
import UserManager from '../../dao/UserManager.js';
import { createHash, isValidPassword } from '../../helpers/utils.js'
import passport from 'passport';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/sessions/register', async (req, res) => {
    const { body } = req;
    // Se crea el hash de la contraseña antes de guardar el usuario en la base de datos
    const newUser = await UserManager.create({
        ...body,
        password: createHash(body.password)
    });
    console.log('newUser', newUser);
    res.redirect('/login');
});

// Ruta para iniciar sesión
router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), (req, res) => {
    // Se guarda la sesión del usuario
    req.session.user = req.user;
    res.redirect('/products')
});

// Ruta para iniciar sesión con GitHub
router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de autenticación con GitHub
router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Se guarda la sesión del usuario
    req.session.user = req.user;
    res.redirect('/products')
});

// Ruta para recuperar contraseña
router.post('/sessions/password-recovery', async (req, res) => {
    const { email, newPassword } = req.body;
    // Se busca el usuario por su correo electrónico
    const user = await UserManager.getByMail(email)
    if (!user) {
        return res.status(401).send('Correo o contraseña inválidos.');
    }
    try {
        // Se actualiza la contraseña del usuario
        const updatedUser = await UserManager.update(email, newPassword)
        if (updatedUser) {
            res.redirect('/login')
        } else {
            res.status(500).json({ message: "Error al actualizar el usuario" })
        }
    } catch (error) {
        console.log('Error', error.message)
        res.status(500).json({ message: "Error al actualizar el usuario" })
    }
});

// Ruta para cerrar sesión
router.get('/sessions/logout', (req, res) => {
    // Se destruye la sesión del usuario
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});

export default router;
