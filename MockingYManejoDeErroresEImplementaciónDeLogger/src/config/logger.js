// Importo el módulo 'winston' que proporciona funcionalidades para el registro de logs.
import winston from 'winston';

// Importo el archivo de configuración 'config.js', donde probablemente tengo información de configuración de mi aplicación.
import config from '../config.js'

// Defino opciones personalizadas para los niveles de registro y sus colores correspondientes.
const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "cyan",
        debug: "white"
    }
}

// Creo un logger para entornos de producción con las opciones personalizadas que definí anteriormente.
const loggerProd = winston.createLogger({
    levels: customLevelsOptions.levels, // Defino los niveles de registro personalizados.
    transports: [
        // Configuro el registro en la consola para niveles 'info' y superiores.
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }), // Aplico colores a los logs según los niveles definidos.
                winston.format.simple() // Utilizo un formato simple para los logs.
            ),
        }),
        // Configuro el registro en un archivo llamado 'errors.log' para el nivel 'error'.
        new winston.transports.File({
            filename: './errors.log',
            level: 'error'
        })
    ]
})

// Creo un logger para entornos de desarrollo con las opciones personalizadas que definí anteriormente.
const loggerDev = winston.createLogger({
    levels: customLevelsOptions.levels, // Defino los niveles de registro personalizados.
    transports: [
        // Configuro el registro en la consola para niveles 'debug' y superiores.
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }), // Aplico colores a los logs según los niveles definidos.
                winston.format.simple() // Utilizo un formato simple para los logs.
            ),
        })
    ]
})

// Exporto una función llamada 'addLogger' que probablemente se utiliza como un middleware en la aplicación.
// Esta función añade un logger al objeto 'req' (solicitud HTTP) dependiendo del entorno (producción o desarrollo).
export const addLogger = (req, res, next) => {
    req.logger = config.ENV === 'prod' ? loggerProd : loggerDev // Asigno el logger correspondiente al entorno.
    req.logger.http(`${req.method} en ${req.url} - ${(new Date().toLocaleTimeString())}`) // Registro un mensaje HTTP con el método, URL y tiempo.
    next(); // Llamo a la siguiente función en la cadena de middleware.
}
