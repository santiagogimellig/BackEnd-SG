export default {
    // Entorno de la aplicación (por defecto 'dev' si no se especifica)
    ENV: process.env.NODE_ENV || 'dev',

    // Tipo de persistencia de datos (no está comentado, posiblemente se refiere a la capa de persistencia)
    persistence: process.env.PERSISTENCE,

    // Puerto en el que se ejecutará el servidor (por defecto 8080 si no se especifica)
    port: process.env.SERVER_PORT || 8080,

    // Configuraciones de la base de datos MongoDB
    db: {
        // URL de conexión a la base de datos MongoDB en entorno de producción
        mongodbURL: process.env.DB_MONGO_ATLAS,

        // URL de conexión a la base de datos MongoDB en entorno de pruebas (test)
        mongodbURL_TEST: process.env.DB_MONGO_ATLAS_TEST
    },

    // Clave secreta utilizada para firmar JWT (JSON Web Tokens)
    jwtSecret: process.env.JWT_SECRET,

    // Clave secreta utilizada para sesiones de usuario
    sessionSecret: process.env.SESSION_SECRET,

    // Configuraciones relacionadas con la autenticación de GitHub
    github: {
        // URL de callback para autenticación con GitHub
        urlCallbackGithub: process.env.URL_CALLBACK_GITHUB,

        // Cliente de la aplicación registrada en GitHub
        clientGithub: process.env.CLIENT_GITHUB,

        // Clave secreta de la aplicación registrada en GitHub
        secretGithub: process.env.SECRET_GITHUB
    },

    // Configuraciones de correo electrónico
    mail: {
        // Servicio de correo electrónico (por defecto 'gmail' si no se especifica)
        service: process.env.EMAIL_SERVICE || 'gmail',

        // Puerto de conexión al servicio de correo electrónico (por defecto 587 si no se especifica)
        port: process.env.EMAIL_PORT || 587,

        // Usuario de correo electrónico
        user: process.env.EMAIL_USER,

        // Contraseña de la aplicación
        password: process.env.APP_PASS,
    }
}