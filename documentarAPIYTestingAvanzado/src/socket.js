// Importación de módulos y controladores necesarios
import { initDb } from './db/mongodb.js';
import { Server } from 'socket.io';
import ProductsController from './controllers/products.controller.js';
import CartController from './controllers/cart.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MessageController from './controllers/message.controller.js';
import { verifyToken } from './helpers/utils.js';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const absolutePath = path.resolve(__dirname, '../src/data/products.json');

// Declaración de variables globales
let io; // Instancia del servidor Socket.IO
let messages = []; // Arreglo para almacenar mensajes

// Función de inicialización del servidor
export const init = async (httpServer) => {
    // Inicialización de la base de datos
    await initDb();
    
    // Creación de una instancia de Socket.IO asociada al servidor HTTP
    io = new Server(httpServer);
    
    // Manejo de eventos de conexión con clientes
    io.on('connection', async (socketClient) => {
        // Cuando un nuevo cliente se conecta
        console.log(`Se ha conectado un nuevo cliente (${socketClient.id})`);
        
        // Obtener y enviar mensajes previos al cliente recién conectado
        const messages = await MessageController.get();
        socketClient.emit('listMessages', messages);
        socketClient.broadcast.emit('new-client'); // Emitir a todos excepto al cliente actual
        
        // Manejo de eventos relacionados con mensajes
        socketClient.on('new-message', async (data) => {
            const { username, text } = data;
            // Crear un nuevo mensaje
            let newMessage = await MessageController.create(data);
            // Obtener todos los mensajes actualizados
            let allMessages = await MessageController.get();
            // Emitir a todos los clientes la actualización de mensajes
            io.emit('notification', allMessages);
        });

        // Obtener y enviar la lista de productos al cliente
        const products = await ProductsController.get();
        socketClient.emit('listProducts', products);

        // Obtener y enviar la lista de carritos al cliente
        const carts = await CartController.get();
        socketClient.emit('listCarts', carts);

        // Manejar eventos relacionados con productos
        socketClient.on('addProduct', async (newProduct) => {
            // Agregar un nuevo producto
            await ProductsController.create(newProduct);
            // Obtener y emitir la lista de productos actualizada
            let products = await ProductsController.get();
            io.emit('listProducts', products);
        });

        socketClient.on('deleteProduct', async (productId) => {
            // Eliminar un producto por su ID
            await ProductsController.deleteById(productId);
            // Obtener y emitir la lista de productos actualizada
            let products = await ProductsController.get();
            io.emit('listProducts', products);
        });

        socketClient.on('updateProduct', async (product) => {
            // Actualizar un producto por su ID
            await ProductsController.updateById(product._id, product);
            // Obtener y emitir la lista de productos actualizada
            let products = await ProductsController.get();
            io.emit('listProducts', products);
        });

        // Manejar eventos relacionados con carritos
        socketClient.on('createCart', async (newCart) => {
            // Crear un nuevo carrito
            await CartController.create(newCart);
            // Obtener y emitir la lista de carritos actualizada
            let carts = await CartController.get();
            io.emit('listCarts', carts);
        });

        socketClient.on('addProductToCart', async (product) => {
            try {
                let findedProduct = await ProductsController.getById(product._id);
                if (findedProduct) {
                    // Agregar un producto al carrito
                    await CartController.addProductToCart(product.cartId, findedProduct._id, product.quantity);
                    // Obtener y emitir la lista de carritos actualizada
                    let carts = await CartController.get();
                    io.emit('listCarts', carts);
                } else {
                    // Manejar el caso en que el producto no se encuentra
                    req.logger.warning('Product not found');
                }
            } catch (error) {
                console.log('error: ', error.message);
            }
        });

        socketClient.on('deleteCart', async (cartId) => {
            // Eliminar un carrito por su ID
            await CartController.deleteById(cartId);
            // Obtener y emitir la lista de carritos actualizada
            let carts = await CartController.get();
            io.emit('listCarts', carts);
        });

        socketClient.on('cartPurchase', async (cartId) => {
            // Marcar un carrito como comprado
            await CartController.createPurchase(cartId);
            // Obtener y emitir la lista de carritos actualizada
            let carts = await CartController.get();
            io.emit('listCarts', carts);
        });

        // Manejar el evento de desconexión del cliente
        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`);
        });
    });

    // Mensaje de confirmación de que el servidor de socket está en funcionamiento
    console.log('Server socket running');
}

// Función para emitir eventos desde la API
export const emitFromApi = (event, data) => io.emit(event, data);