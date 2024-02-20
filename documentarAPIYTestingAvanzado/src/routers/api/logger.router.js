import { Router } from 'express'; // Importar el enrutador de Express

const router = Router(); // Crear un nuevo enrutador

// Definir ruta para pruebas de registro
router.get('/loggerTest', (req, res) => {
    // Registrar diferentes niveles de mensajes de registro
    req.logger.fatal(`Logger fatal`); // Mensaje de registro fatal
    req.logger.error(`Logger error`); // Mensaje de registro de error
    req.logger.warning(`Logger warning`); // Mensaje de registro de advertencia
    req.logger.info(`Logger info`); // Mensaje de registro de información
    req.logger.http(`Logger http`); // Mensaje de registro de HTTP
    req.logger.debug(`Logger debug`); // Mensaje de registro de depuración
});

export default router; // Exportar el enrutador