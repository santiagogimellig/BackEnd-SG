import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

// Obtengo rutas del archivo actual.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creo una aplicacion Express.
const app = express();

// Creo un servidor HTTP y lo asocio con la aplicacion Express.
const server = http.createServer(app);

// Inicializo Socket.IO con el servidor HTTP.
const io = new Server(server);

// Configuro el motor de plantillas Handlebars.
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la pagina de inicio.
app.get('/', (req, res) => {
    res.render('home');
});

// Ruta para la pagina de productos en tiempo real.
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        productos: getProductList()
    });
});

// Funcion para obtener una lista de productos.
function getProductList() {
    const productos = [
        { name: 'Producto 1', price: 100 },
        { name: 'Producto 2', price: 200 }
    ];
    return productos;
}

// Manejo conexiones de Socket.IO.
let prods = getProductList();
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Manejo evento 'addProduct'.
    socket.on("addProduct", (product) => {
        prods.push(product);
        io.emit("updateProducts", prods);
    });

    // Manejo evento 'removeProduct'.
    socket.on("removeProduct", (productId) => {
        prods = prods.filter(product => product.id !== productId);
        io.emit("updateProducts", prods);
    });    
});

// Inicio el servidor en el puerto 8080.
server.listen(8080, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:8080`);
});