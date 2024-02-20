// Importo el módulo winston para manejar los logs
import winston from 'winston';
// Importo la configuración desde el archivo config.js
import config from '../config.js'

// Defino opciones personalizadas para los niveles de logs y sus colores asociados
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

// Configuro el logger para el entorno de producción
const loggerProd = winston.createLogger({
    levels: customLevelsOptions.levels, // Establezco los niveles de logs
    transports: [
        // Utilizo un transporte para imprimir logs en la consola con nivel 'info' o superior
        new winston.transports.Console({
            level: 'info', // Establezco el nivel mínimo para imprimir logs
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }), // Aplico colores a los logs
                winston.format.simple() // Utilizo un formato simple
            ),
        }),
        // Utilizo un transporte para guardar logs en un archivo con nivel 'error'
        new winston.transports.File({
            filename: './errors.log', // Especifico el nombre del archivo de logs
            level: 'error' // Establezco el nivel mínimo para guardar logs en este archivo
        })
    ]
});

// Configuro el logger para el entorno de desarrollo
const loggerDev = winston.createLogger({
    levels: customLevelsOptions.levels, // Establezco los niveles de logs
    transports: [
        // Utilizo un transporte para imprimir logs en la consola con nivel 'debug' o superior
        new winston.transports.Console({
            level: 'debug', // Establezco el nivel mínimo para imprimir logs
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }), // Aplico colores a los logs
                winston.format.simple() // Utilizo un formato simple
            ),
        })
    ]
});

// Exporto una función middleware para agregar el logger a las solicitudes
export const addLogger = (req, res, next) => {
    // Verifico si el entorno es de producción para seleccionar el logger adecuado
    req.logger = config.ENV === 'prod' ? loggerProd : loggerDev
    // Agrego un log HTTP indicando el método de la solicitud, la URL y la hora
    req.logger.http(`${req.method} en ${req.url} - ${(new Date().toLocaleTimeString())}`)
    // Paso al siguiente middleware
    next();
}