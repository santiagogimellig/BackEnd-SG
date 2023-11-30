import http from 'http';
import app from './app.js';
import { init as initMongoDB } from './data/mongodb.js';
import { Server } from 'socket.io';
import MessageManager from './data/dbManagers/message_manager.js';

await initMongoDB();

const server = http.createServer(app);
const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT} 🚀`);
});

const io = new Server(server);
app.set('socketio', io);

const messages = [];
const messageManager = new MessageManager();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('message', async (data) => {
        try {
            await messageManager.add(data);
            const messages = await messageManager.getAll();
            io.emit('messageLogs', messages);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('authenticated', (data) => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});