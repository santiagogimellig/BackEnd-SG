import { Router } from "express";
import userModel from "../data/models/users_model.js";
import { createHash, isValidPassword, tokenGenerator, jwtAuth } from '../../utils.js';
import passport from "passport";

const router = Router();

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    });
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log('req.user', req.user);
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

//JWT

router.post('/login', async (req, res) => {
    const { body: { email, password } } = req;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos' });
    }
    console.log('user', user);
    const isPassValid = isValidPassword(password, user);
    if (!isPassValid) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos' });
    }
    const token = tokenGenerator(user);
    res.status(200).json({ access_toekn: token });
});

router.post('/register', async (req, res) => {
    const { body } = req;
    let user = await userModel.findOne({ email: body.email });
    if (user) {
        return res.status(400).json({ message: `Ya existe un usuario con el correo ${body.email}.` });
    }
    user = await userModel.create({
        ...body,
        password: createHash(body.password),
    });
    const token = tokenGenerator(user);
    res.status(201).json({ access_toekn: token });
});

router.get('/current', jwtAuth, (req, res) => {
    res.status(200).json(req.user);
});

export default router;