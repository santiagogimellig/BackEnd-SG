import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', handlebars.__express);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        productos: getProductList()
    });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('addProduct', (product) => {
        io.emit('updateProducts', getProductList());
    });

    socket.on('removeProduct', (productId) => {
        io.emit('updateProducts', getProductList());
    });
});

function getProductList() {
    const productos = [
        { name: 'Producto 1', price: 100 },
        { name: 'Producto 2', price: 200 }
    ];
    return productos;
}

server.listen(8080, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:8080`);
});
