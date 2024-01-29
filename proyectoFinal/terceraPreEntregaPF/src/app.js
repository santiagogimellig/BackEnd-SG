// Importación de los módulos necesarios
import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import __dirname from './utils.js';  // Importación de un módulo personalizado
import viewRouter from "./router/views.routes.js";  // Importación de rutas para vistas
import sessionRouter from './router/sessions.routes.js';  // Importación de rutas para sesiones
import productRouter from './router/products.routes.js';  // Importación de rutas para productos
import cartRouter from './router/carts.routes.js';  // Importación de rutas para carritos
import initializePassport from './config/passport.config.js';  // Configuración de Passport
import { config } from "./config/config.js";  // Importación de configuración
import { Server } from "socket.io";  // Importación del servidor de sockets
import chatService from "./services/chat.service.js";  // Importación del servicio de chat

// Configuración de variables
const PORT = config.server.port;
const MONGO = config.mongo.url;
const SECRET = config.session.secret;

// Creación de una aplicación Express
const app = express();
app.use(express.static(__dirname + '/public'));  // Configuración de archivos estáticos

// Configuración de sesiones con almacenamiento en MongoDB
const sessionMiddleware = session({
  store: new MongoStore({
    mongoUrl: MONGO,
    ttl: 3600
  }),
  secret: SECRET,
  resave: false,
  saveUninitialized: false
})

app.use(sessionMiddleware)

// Inicialización y configuración de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Conexión a la base de datos MongoDB
const connection = mongoose.connect(MONGO);

// Configuración para procesar datos JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Inicialización del servidor HTTP y del servidor de sockets
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT} 🚀`);
})

const socketServer = new Server(server);

// Manejo de errores en el servidor HTTP
server.on('error', error => console.log(`Error en el servidor ${error}`));

// Wrappers para el middleware de sesiones y autenticación de sockets
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
socketServer.use(wrap(sessionMiddleware));

// Middleware para verificar la autorización del usuario en el socket
socketServer.use((socket, next) => {
  const session = socket.request.session;
  console.log(session)
  if (session && session.user.rol == "user") {
    next();
  } else {
    console.log("No autorizado")
    next(new Error("No autorizado"));
  }
});

// Configuración de rutas para productos, carritos, vistas y sesiones
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/", viewRouter);
app.use('/api/session', sessionRouter);

// Manejo de eventos de conexión en el servidor de sockets
socketServer.on("connection", async (socketConnected) => {
  console.log(`Nuevo cliente conectado ${socketConnected.id}`);
  // Obtención del historial de mensajes y emisión a todos los clientes
  const messages = await chatService.getMessages();
  socketServer.emit("msgHistory", messages);

  // Manejo del evento de mensaje enviado por un cliente
  socketConnected.on("message", async (data) => {
    // Guardar el mensaje en el servidor y obtener el nuevo historial de mensajes
    await chatService.addMessage(data);
    const messages = await chatService.getMessages();
    // Emitir el historial actualizado a todos los clientes
    socketServer.emit("msgHistory", messages);
  });
});
