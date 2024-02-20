// Importa el módulo Router de Express
import { Router } from "express";

// Importa el controlador de usuarios y algunas funciones de utilidad
import UsersController from "../../controllers/users.controller.js";
import { isValidPassword, tokenGenerator } from "../../helpers/utils.js";

// Crea una instancia de Router
const router = Router();

// Middleware para redirigir a la página de inicio de sesión si el usuario no está autenticado
const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware para redirigir a la página de productos si el usuario ya está autenticado
const publicRouters = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
}

// Ruta para la página de inicio
router.get('/', (req, res) => {
    res.status(200).send('<h1>Hello World </h1>')
})

// Ruta para la página de inicio de sesión
router.get('/login', publicRouters, (req, res) => {
    res.render('login', { title: 'Login' });
});

// Ruta para procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersController.getByMail(email);
    if (!user) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }
    const isPassValid = isValidPassword(password, user);
    if (!isPassValid) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }
    // Genera un token de acceso válido y lo devuelve como respuesta
    const token = tokenGenerator(user)
    res.status(200).json({ access_token: token });
})

// Exporta el enrutador para su uso en otras partes de la aplicación
export default router;