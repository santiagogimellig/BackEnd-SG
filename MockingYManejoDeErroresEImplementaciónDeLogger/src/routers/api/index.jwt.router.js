import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import { isValidPassword, tokenGenerator } from "../../helpers/utils.js";

// Se crea una nueva instancia de Router
const router = Router();

// Middleware para redireccionar a la página de inicio de sesión si el usuario no está autenticado
const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware para redireccionar a la página de productos si el usuario ya está autenticado
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
    // Se obtienen el correo electrónico y la contraseña de la solicitud
    const { email, password } = req.body;
    // Se busca el usuario por su correo electrónico utilizando el controlador correspondiente
    const user = await UsersController.getByMail(email);
    // Si no se encuentra el usuario, se devuelve un mensaje de error
    if (!user) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }
    // Se verifica si la contraseña es válida
    const isPassValid = isValidPassword(password, user);
    // Si la contraseña no es válida, se devuelve un mensaje de error
    if (!isPassValid) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }
    // Se genera un token de acceso utilizando el usuario y se devuelve en la respuesta
    const token = tokenGenerator(user)
    res.status(200).json({ access_token: token });
})

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router
