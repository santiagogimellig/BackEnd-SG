// Importo las funcionalidades necesarias de Express, Passport y otros módulos
import { Router } from 'express';
import passport from 'passport';
import usersService from '../services/users.service.js';
import { registerConfirmation } from '../messages/email/nodemailer.js';

// Creo una instancia del enrutador de Express
const router = Router();

// Ruta para el registro de usuarios
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    // Envío de confirmación por correo electrónico después del registro
    let to_email = req.user.email;
    let result = await registerConfirmation(to_email);
    console.log('Email result:', result);
    res.send({ status: "success", message: "User registered" });
});

// Ruta para el manejo de fallos en el registro
router.get('/failregister', async (req, res) => {
    console.log('Fallo en el registro');
    res.send({ error: 'Error en el registro' });
});

// Ruta para el inicio de sesión
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });
    // Almacenar información del usuario en la sesión
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    };
    res.send({ status: "success", payload: req.user, message: "Primer logueo!!" });
});

// Ruta para el manejo de fallos en el inicio de sesión
router.get('/faillogin', async (req, res) => {
    console.log('Fallo en el ingreso');
    res.send({ error: 'Error en el ingreso' });
});

// Ruta para obtener el usuario actualmente autenticado
router.get('/current', async function (req, res) {
    if (req.isAuthenticated()) {
        // Usuario autenticado, devolver el usuario actual
        let publicUser = await usersService.getPublicUser(req.user);
        res.json({ user: publicUser });
    } else {
        // Usuario no autenticado
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Rutas relacionadas con la autenticación a través de GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    // Almacenar información del usuario en la sesión después de la autenticación de GitHub
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
        githubProfile: req.user.githubProfile
    };
    console.log('UserGithub', req.user);
    res.redirect('/');
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" });
        res.redirect('/');
    });
});

// Exporto el enrutador configurado con las rutas definidas
export default router;