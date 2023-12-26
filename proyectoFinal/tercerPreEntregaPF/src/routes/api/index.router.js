import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
    res.render('profile', { title: 'Perfil', user: req.session.user });
});

router.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});
router.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/')
});
router.get('/recovery-password', (req, res) => {
    res.render('recovery-password', { title: 'Recuperar Contraseña' });
});

export default router;