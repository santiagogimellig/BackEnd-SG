import { Router } from "express";
import userModel from "../data/models/users_model.js";
import { createHash, isValidPassword } from '../utils.js';
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), (req, res) => {
    res.redirect('/login');
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/home');
});

router.post('/recovery-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await userModel.findOne({ email });

        if (!userExists) {
            return res.status(401).send({ status: 'error', error: 'El usuario o la contraseña proporcionados son incorrectos.' });
        }

        await userModel.updateOne({ email }, { $set: { password: createHash(password) } });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 'error', error: 'Se produjo un error al restablecer la contraseña.' });
    }
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send({ status: 'success', message: 'Usuario registrado exitosamente.' });
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/home');
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión.' });
        }
        res.redirect('/home');
    });
});

export default router;