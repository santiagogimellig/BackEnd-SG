import { Router } from 'express';

// Se crea una nueva instancia de Router
const router = Router();

// Ruta para probar los niveles de registro del logger
router.get('/loggerTest', (req, res) => {
    // Se registran diferentes mensajes de registro utilizando el logger adjunto a la solicitud (req.logger)
    req.logger.fatal(`Logger fatal`);
    req.logger.error(`Logger error`);
    req.logger.warning(`Logger warning`);
    req.logger.info(`Logger info`);
    req.logger.http(`Logger http`);
    req.logger.debug(`Logger debug`);
    // Se envía una respuesta exitosa
    res.status(200).send('Logger test completed successfully');
});

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router;
