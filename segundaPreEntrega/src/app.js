import express from "express"
import path from "path"
import cartRouter from "./routers/cart.router.js"
import productsRouter from "./routers/products.router.js"
import exphbs from 'express-handlebars';
import { __dirname } from './utils.js';
import { socketServer } from "./server.js"
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/main', (req, res) => {
    console.log(storedUserData)
    res.render('home', storedUserData);
});

app.use((error, req, res, next) => {
    const errorMessage = `An error was recorded: ${error}`;
    console.log(errorMessage);
    res.status(500).json({status: 'error', errorMessage})
})

app.use((req, res, next) => {
    req.socketServer = socketServer;
    next();
});

app.use('/api', cartRouter, productsRouter);

export default app;
