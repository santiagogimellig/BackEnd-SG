import app from './app.js';
import {Server as WebsocketServer} from 'socket.io';
import http from 'http';
import {connectDB} from './db.js';

connectDB();

const server = http.createServer(app);
const httpServer = server.listen(8080);
const io = new WebsocketServer(httpServer);

console.log('server is running on port 8080');