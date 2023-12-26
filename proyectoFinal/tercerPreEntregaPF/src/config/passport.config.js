import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userModel from '../models/users_model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

const options = {
    usernameField: 'email',
    passReqToCallback: true,
};

export const init = () => {
    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age, email } = req.body;
            const user = await userModel.findOne({ email });
            if (user) {
                return done(new Error('El usuario ya está registrado'));
            }
            const hashedPassword = createHash(password);
            const newUser = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
            });
            done(null, newUser);
        } catch (error) {
            done(new Error(`Error en el registro: ${error.message}`));
        }
    }));

    passport.use('login', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user || !isValidPassword(password, user)) {
                return done(new Error('Correo o contraseña inválidos'));
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/github/callback',
        scope: ['user:email'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Perfil de GitHub: ', profile);
            const email = profile.emails[0].value;
            const user = await userModel.findOne({ email });
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: '',
                    email,
                    password: '',
                };
                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};