import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

// Importo el módulo Passport y las estrategias locales y de Github
import passport from 'passport';
import { Strategy as LocalStrategy, Strategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2'

// Importo funciones de utilidad y gestores necesarios
import { createHash, isValidPassword } from '../helpers/utils.js';
import UserManager from '../dao/UserManager.js';
import UsersController from '../controllers/users.controller.js';

// Importo la configuración desde el archivo config.js
import config from '../config.js';

// Defino opciones para la estrategia local
const options = {
    usernameField: 'email', // Campo utilizado como nombre de usuario
    passReqToCallback: true, // Pasa la solicitud HTTP al callback de autenticación
}

// Defino opciones para la estrategia de Github
const githubOptions = {
    clientID: config.github.clientGithub, // ID de cliente de Github
    clientSecret: config.github.secretGithub, // Clave secreta de Github
    callbackURL: config.github.urlCallbackGithub // URL de devolución de llamada de Github
}

// Defino opciones para la estrategia JWT
const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Extraigo el JWT del objeto de solicitud
    secretOrKey: config.jwtSecret // Clave secreta utilizada para firmar el JWT
}

// Función para extraer el token JWT de las cookies de la solicitud
function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.access_token;
    }
    return token
}

// Inicializo Passport y defino las estrategias de autenticación
export const init = () => {
    // Estrategia de registro local
    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            // Verifico si el usuario ya está registrado
            const user = await UserManager.getByMail(email);
            if (user) {
                return done(new Error('El usuario ya está registrado'));
            }
            // Creo un nuevo usuario con la información proporcionada
            const newUser = await UserManager.create({
                ...req.body,
                password: createHash(password) // Creo un hash de la contraseña antes de almacenarla
            })
            done(null, newUser); // Devuelvo el nuevo usuario
        } catch (error) {
            done(new Error(`Ocurrió un error durante la autenticación: ${error.message}.`));
        }
    }))

    // Estrategia de inicio de sesión local
    passport.use('login', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            // Obtengo el usuario por su correo electrónico
            const user = await UserManager.getByMail(email);
            if (!user) {
                return done(new Error('Correo electrónico o contraseña inválidos'));
            }
            // Verifico si la contraseña es válida
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done(new Error('Correo electrónico o contraseña inválidos'));
            }
            done(null, user); // Devuelvo el usuario si la autenticación es exitosa
        } catch (error) {
            done(new Error(`Ocurrió un error durante la autenticación: ${error.message}.`));
        }
    }))

    // Estrategia de autenticación con Github
    passport.use('github', new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email
        let user = await UserManager.getByMail(email)
        if (user) {
            return done(null, user)
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email,
            age: 45,
            password: "",
            rol: "user",
            provider: "Github"
        }
        const newUser = await UserManager.create(user);
        done(null, newUser);
    }))

    // Estrategia de autenticación JWT
    passport.use('jwt', new JWTStrategy(JWTOptions, async (payload, done) => {
        const user = await UsersController.getById(payload.id)
        return done(null, user)
    }))

    // Serializo el usuario para almacenarlo en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserializo el usuario a partir de su ID almacenado en la sesión
    passport.deserializeUser(async (uid, done) => {
        const user = await UsersController.getById(uid);
        done(null, user);
    });
}