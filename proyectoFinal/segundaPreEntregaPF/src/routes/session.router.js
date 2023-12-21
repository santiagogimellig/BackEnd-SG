import { Router } from "express";
import userModel from "../data/models/users_model.js";
import { createHash, isValidPassword } from '../utils.js';
import passport from "passport";

const router = Router();

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    });
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})

router.post('/sessions/register', async (req, res) => {
    const { body } = req
    const newUser = await userModel.create({ ...body, password: createHash(body.password) })
    console.log('newUser', newUser);
    res.redirect('/login');
})


router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), (req, res) => {
    res.redirect('/login');
})

router.post('/sessions/login', async (req, res) => {
    const { body: { email, password } } = req;
    const userAdmin = {
        username: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        rol: "admin"
    };
    if (email === userAdmin.username && password === userAdmin.password) {
        req.session.user = { first_name: "Admin", last_name: "Coderhouse", email: userAdmin.username, rol: userAdmin.rol };
        return res.redirect('/products');
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).send('Correo o contraseña invalidos.');
    }
    const isValidPass = isValidPassword(password, user)
    if (!isValidPass) {
        return res.status(401).send('Correo o contraseña invalidos.');
    }
    const { first_name, last_name } = user;
    req.session.user = { first_name, last_name, email };
    res.redirect(`/products`);
});

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.post('/sessions/recovery-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
        return res.status(401).send('Correo o contraseña invalidos.');
    }
    await userModel.updateOne({ email }, { $set: { password: createHash(newPassword) } });
    res.redirect('/login');
});

export default router;