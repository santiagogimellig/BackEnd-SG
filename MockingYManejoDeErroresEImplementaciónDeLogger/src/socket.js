import { initDb } from './db/mongodb.js'; // Importa la función para inicializar la base de datos MongoDB desde un archivo separado.
import { Server } from 'socket.io'; // Importa la clase Server de la biblioteca Socket.IO para manejar la comunicación mediante sockets.
import ProductsController from './controllers/products.controller.js'; // Importa el controlador de productos para interactuar con la base de datos de productos.
import CartController from './controllers/cart.controller.js'; // Importa el controlador de carritos para interactuar con la base de datos de carritos.
import path from 'path'; // Importa el módulo 'path' para manejar rutas de archivos y directorios.
import { fileURLToPath } from 'url'; // Importa la función para convertir una URL en la ruta de un archivo.
import { dirname } from 'path'; // Importa la función para obtener el nombre del directorio de un archivo.
import MessageController from './controllers/message.controller.js'; // Importa el controlador de mensajes para interactuar con la base de datos de mensajes.
import { verifyToken } from './helpers/utils.js'; // Importa una función para verificar tokens de autenticación.

// Obtiene la ruta y el directorio del archivo actual.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const absolutePath = path.resolve(__dirname, '../src/data/products.json');

let io; // Declara una variable para almacenar la instancia del servidor de sockets.
let messages = []; // Declara una variable para almacenar los mensajes del chat.

// Función para inicializar el servidor de sockets.
export const init = async (httpServer) => {
    await initDb(); // Inicializa la base de datos MongoDB.

    // Crea una instancia del servidor de sockets y lo asocia con el servidor HTTP existente.
    io = new Server(httpServer);

    // Maneja el evento de conexión de un nuevo cliente.
    io.on('connection', async (socketClient) => {
        console.log(`Se ha conectado un nuevo cliente (${socketClient.id})`);

        // Emite la lista de mensajes al cliente que se ha conectado.
        const messages = await MessageController.get();
        socketClient.emit('listMessages', messages);

        // Emite una notificación a todos los clientes, excepto al cliente recién conectado.
        socketClient.broadcast.emit('new-client');

        // Maneja el evento de recibir un nuevo mensaje del cliente.
        socketClient.on('new-message', async (data) => {
            const { username, text } = data;
            let newMessage = await MessageController.create(data)
            let allMessages = await MessageController.get();
            io.emit('notification', allMessages);
        })

        // Emite la lista de productos al cliente que se ha conectado.
        const products = await ProductsController.get()
        socketClient.emit('listProducts', products)

        // Emite la lista de carritos al cliente que se ha conectado.
        const carts = await CartController.get();
        socketClient.emit('listCarts', carts)

        // Maneja el evento de agregar un nuevo producto recibido desde el cliente.
        socketClient.on('addProduct', async (newProduct) => {
            await ProductsController.create(newProduct)
            let products = await ProductsController.get()
            io.emit('listProducts', products)
        })

        // Maneja el evento de eliminar un producto recibido desde el cliente.
        socketClient.on('deleteProduct', async (productId) => {
            await ProductsController.deleteById(productId)
            let products = await ProductsController.get();
            io.emit('listProducts', products)
        })

        // Maneja el evento de actualizar un producto recibido desde el cliente.
        socketClient.on('updateProduct', async (product) => {
            await ProductsController.updateById(product._id, product)
            let products = await ProductsController.get();
            io.emit('listProducts', products)
        })

        // Maneja el evento de crear un nuevo carrito recibido desde el cliente.
        socketClient.on('createCart', async (newCart) => {
            await CartController.create(newCart);
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        // Maneja el evento de agregar un producto al carrito recibido desde el cliente.
        socketClient.on('addProductToCart', async (product) => {
            try {
                let findedProduct = await ProductsController.getById(product._id)
                if (findedProduct) {
                    await CartController.addProductToCart(product.cartId, findedProduct._id, product.quantity)
                    let carts = await CartController.get()
                    io.emit('listCarts', carts)
                } else {
                    req.logger.warning('Product not found')
                }
            }
            catch (error) {
                console.log('error: ', error.message)
            }
        })

        // Maneja el evento de eliminar un carrito recibido desde el cliente.
        socketClient.on('deleteCart', async (cartId) => {
            await CartController.deleteById(cartId);
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        // Maneja el evento de realizar una compra desde el carrito recibido desde el cliente.
        socketClient.on('cartPurchase', async (cartId) => {
            await CartController.createPurchase(cartId)
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        // Maneja el evento de desconexión de un cliente.
        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`)
        })
    })

    console.log('Server socket running ');
}

// Función para emitir eventos desde la API a través de sockets.
export const emitFromApi = (event, data) => io.emit(event, data);
