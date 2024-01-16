import { Router } from 'express';
import UserModel from '../../models/users_model.js';
import { createHash, isValidPassword, tokenGenerator } from "../../utils.js";
import CartManager from '../../dao/cart_manager.js'
import mongoose from 'mongoose';
import cartModel from '../../models/cart_model.js';


const router = Router();

router.post('/auth/register', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        age,
    } = req.body;
    if (
        !first_name ||
        !last_name ||
        !email ||
        !age ||
        !password
    ) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    let user = await UserModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Correo ya registrado. Intenta recuperar tu contraseña.' });
    }
    user = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    });
    const cart = await CartManager.getOrCreateCart(user._id);
    user.cart = cart._id;
    await user.save();
    const token = tokenGenerator(user, user.cart);
    res.cookie('access_token', token, { httpOnly: true, signed: true });
    res.status(201)
        .redirect('/')
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const cart = await CartManager.getOrCreateCart(user._id);
    if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos' });
    }
    const isValidPassword = isPasswordValid(password, user);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos' });
    }
    const token = tokenGenerator(user, cart._id);
    res
        .cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true })
        .status(200)
        .redirect('/products')
});
router.post('/auth/recovery-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).send('Correo o contraseña invalidos.')
    };
    await UserModel.updateOne({ email }, { $set: { password: createHash(newPassword) } });
    res.redirect('/login');
});

export default router;