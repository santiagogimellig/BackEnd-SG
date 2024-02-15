// Importo el módulo 'passport' que se utiliza para la autenticación en Node.js.
import passport from 'passport';

// Importo la estrategia local de autenticación y la estrategia de autenticación con GitHub desde 'passport-local' y 'passport-github2' respectivamente.
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';

// Importo las funciones 'createHash' y 'isValidPassword' desde un archivo de utilidades.
import { createHash, isValidPassword } from '../helpers/utils.js';

// Importo la estrategia de autenticación con JWT y otras funciones relacionadas desde 'passport-jwt'.
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

// Importo el gestor de usuarios y el controlador de usuarios desde sus respectivos archivos.
import UserManager from '../dao/UserManager.js';
import UsersController from '../controllers/users.controller.js';

// Importo la configuración de la aplicación desde 'config.js'.
import config from '../config.js';

// Defino las opciones para la estrategia local de autenticación.
const options = {
    usernameField: 'email',
    passReqToCallback: true,
}

// Defino las opciones para la estrategia de autenticación con GitHub.
const githubOptions = {
    clientID: config.github.clientGithub,
    clientSecret: config.github.secretGithub,
    callbackURL: config.github.urlCallbackGithub
}

// Defino las opciones para la estrategia de autenticación con JWT.
const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Extraigo el JWT desde las cookies de la solicitud.
    secretOrKey: config.jwtSecret
}

// Función para extraer el token JWT de las cookies de la solicitud.
function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.access_token;
    }
    return token
}

// Exporto una función 'init' que inicializa las estrategias de autenticación.
export const init = () => {
    // Estrategia de registro de usuarios locales.
    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const user = await UserManager.getByMail(email);
            if (user) {
                return done(new Error('User already registered'));
            }
            const newUser = await UserManager.create({
                ...req.body,
                password: createHash(password)
            })
            done(null, newUser);
        } catch (error) {
            done(new Error(`An error occurred during authentication: ${error.message}.`));
        }
    }))
    
    // Estrategia de inicio de sesión local.
    passport.use('login', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const user = await UserManager.getByMail(email);
            if (!user) {
                return done(new Error('Invalid email or password'));
            }
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done(new Error('Invalid email or password'));
            }
            done(null, user);
        } catch (error) {
            done(new Error(`An error occurred during authentication: ${error.message}.`));
        }
    }))
    
    // Estrategia de autenticación con GitHub.
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
    
    // Estrategia de autenticación con JWT.
    passport.use('jwt', new JWTStrategy(
        JWTOptions,
        async (payload, done) => {
            const user = await UsersController.getById(payload.id)
            return done(null, user)
        }))
    
    // Serialización de usuario para almacenar en sesión.
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    // Deserialización de usuario para recuperar de la sesión.
    passport.deserializeUser(async (uid, done) => {
        const user = await UsersController.getById(uid);
        done(null, user);
    });
}