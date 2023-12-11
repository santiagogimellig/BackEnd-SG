import express from "express";
import expressSesion from 'express-session'
import MongoStore from "connect-mongo";
import handlerbars from 'express-handlebars';
import handlebars from 'handlebars';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionRouter from './routes/session.router.js'
import __dirname from "./utils.js";
import passport from "passport";
import { init as initPassportconfig } from './config/passport.config.js'
import dotenv from 'dotenv';
dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(expressSesion({
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        mongoOptions: {},
        ttl: 120
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlerbars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

handlebars.registerPartial('partials', `${__dirname}/partials`);
handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

initPassportconfig()
app.use(passport.initialize())
app.use(passport.session())
app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);

app.use((error, req, res, next) => {
    const message = `Ah ocurrido un error inesperado 😨: ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

export default app;
