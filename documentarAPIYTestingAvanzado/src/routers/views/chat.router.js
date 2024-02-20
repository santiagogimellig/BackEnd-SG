import { Router } from "express"; // Importar el enrutador de Express
import { emitFromApi } from '../../socket.js'; // Importar función para emitir eventos desde la API a través de sockets
import passport from "passport"; // Importar Passport.js para autenticación
import { authorizationMiddleware } from "../../helpers/utils.js"; // Importar middleware de autorización

const router = Router(); // Crear un nuevo enrutador

// Ruta para cargar la página de chat
router.get('/', passport.authenticate('jwt', { session: false }), authorizationMiddleware('user'), (req, res) => {
    res.render('chat', { title: "Chat" }); // Renderizar la vista de chat con el título "Chat"
});

// Ruta para enviar un mensaje desde la API al chat
router.post('/messages', passport.authenticate('jwt', { session: false }), authorizationMiddleware('user'), (req, res) => {
    emitFromApi('new-message-from-api', { username: 'api', text: 'Hola desde el API' }); // Emitir un nuevo mensaje desde la API a través de sockets
    res.status(200).json({ ok: true }); // Devolver respuesta exitosa en formato JSON
});

export default router; // Exportar el enrutador