import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import http from 'http'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import passport from 'passport';
import express from "express"
import { Server } from "socket.io";
import { log } from 'console';
export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => {
    try {
        console.log('Input Password:', password);
        console.log('Stored Password:', user.password);
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};
export const JWT_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

export const tokenGenerator = (user, cartId) => {
    const {
        _id: id,
        first_name,
        last_name,
        email,
        rol,
    } = user;
    const payload = {
        id,
        first_name,
        last_name,
        email,
        rol,
        cartId
    };
    const token = JWT.sign(payload, JWT_SECRET, { expiresIn: '30m' });
    console.log('token', token);
    return token
}


export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error)
            }
            resolve(payload);
        });
    });
}
export const authenticationMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
        }
        console.log('Received Headers:', req.headers);
        console.log('Received Token:', req.headers.authorization);
        console.log('payload', payload);
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
};

export const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { rol: userRole } = req.user;
    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'No premissions' });
    }
    next();
}

const getNewId = () => uuidv4();

export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status
    }
}
export { getNewId, /* socketServer, */ app }