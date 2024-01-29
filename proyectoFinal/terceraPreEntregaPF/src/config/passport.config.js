// Importo las dependencias necesarias para la autenticación
import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

// Importo la configuración del sistema
import { config } from "./config.js";

// Creo un usuario administrador con información de configuración
const adminUser = {
    _id: config.auth.pass,
    first_name: 'Admin',
    last_name: 'Coderhouse',
    email: config.auth.account,
    password: config.auth.pass,
    age: '7',
    rol: 'admin'
};

// Configuro la estrategia local para el registro de usuarios
const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, rol, age } = req.body;
            if (username == adminUser.username) {
                console.log('El usuario ya existe')
                return done(null, false);
            } else {
                const exist = await userService.findOne({ email: username });
                if (exist) {
                    console.log('El usuario ya existe')
                    return done(null, false);
                }
                const user = {
                    first_name, last_name, email, rol, age, password: createHash(password)
                };
                console.log(user)
                const result = await userService.create(user);
                return done(null, result);
            }
        }
    ));

    // Serializo y deserializo usuarios para las sesiones
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        let user = {}
        if (id == 'adminCod3r123') {
            user = adminUser
        } else {
            user = await userService.findById(id);
        }
        done(null, user)
    });

    // Configuro la estrategia local para el inicio de sesión
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            if (username === adminUser.email && password === adminUser.password) {
                let user = adminUser
                console.log('Usuario conectado', user)
                return done(null, user);
            } else {
                const user = await userService.findOne({ email: username })
                console.log('Usuario conectado:', user)
                if (!user) {
                    console.log('No existe el usuario');
                    return done(null, false);
                }
                const isValidPassword = validatePassword(password, user);
                if (!isValidPassword) return done(null, false);
                return done(null, user);
            }
        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }
    }));

    // Configuro la estrategia de GitHub para la autenticación
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.11650ff67b6d9996',
        clientSecret: '1e62cac5a16eccc7ecf440ada72a4170420e38de',
        callbackURL: 'http://localhost:8080/api/sessions/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile); // Vemos toda la info que viene del perfil de GitHub
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                const email = profile._json.email == null ? profile._json.username : null;
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    age: 18,
                    password: '',
                    rol: 'user',
                    githubProfile: JSON.stringify(profile._json, null, 3)
                }
                const result = await userService.create(newUser);
                console.log('Usuario registrado', result)
                done(null, result)
            } else {
                // El usuario ya existe
                done(null, user)
            }
        } catch (error) {
            return done(null, error)
        }
    }))
}

// Exporto la función de inicialización de Passport
export default initializePassport;