import { Router } from "express";
import { emitFromApi } from '../../socket.js'
import passport from "passport";
import { authorizationMiddleware } from "../../helpers/utils.js";

const router = Router();

// Ruta para cargar la página de chat
router.get('/', passport.authenticate('jwt', { session: false }), authorizationMiddleware('user'), (req, res) => {
    // Renderiza la vista 'chat' con el título "Chat"
    res.render('chat', { title: "Chat" });
})

// Ruta para enviar mensajes desde el API
router.post('/messages', passport.authenticate('jwt', { session: false }), authorizationMiddleware('user'), (req, res) => {
    // Emitir un mensaje desde el API utilizando el método 'emitFromApi'
    emitFromApi('new-message-from-api', { username: 'api', text: 'Hola desde el API' });
    // Responder con un estado 200 y un objeto JSON indicando que la operación fue exitosa
    res.status(200).json({ ok: true });
});

export default router;
