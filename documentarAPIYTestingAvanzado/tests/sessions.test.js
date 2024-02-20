// Importación de módulos necesarios para las pruebas
import { expect } from 'chai'; // Utilizado para realizar afirmaciones en las pruebas
import supertest from 'supertest'; // Utilizado para hacer solicitudes HTTP en las pruebas
import mongoose from 'mongoose'; // ORM para MongoDB
import config from '../src/config.js'; // Archivo de configuración
import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env

// Cliente para realizar solicitudes HTTP a la aplicación en pruebas
const requester = supertest('http://localhost:8080');

// Bloque describe que contiene las pruebas del módulo de sesiones
describe('Test del modulo sessions', function () {
    // Aumenta el tiempo límite para las pruebas debido a operaciones asincrónicas
    this.timeout(8000);
    // Datos de usuario para las pruebas
    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234'
    };

    // Variables necesarias para las pruebas
    let authToken; // Token de autenticación
    let accessToken; // Token de acceso
    let cookie; // Cookie de autenticación

    // Antes de ejecutar las pruebas, se prepara el entorno
    before(async function () {
        // Conexión a la base de datos de prueba
        let cadenaConexion = process.env.DB_MONGO_ATLAS_TEST;
        await mongoose.connect(cadenaConexion);
        // Se eliminan todos los datos de las colecciones de la base de datos
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    });

    // Después de ejecutar las pruebas, se limpia el entorno
    after(async function () {
        // Se eliminan todos los datos de las colecciones de la base de datos
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        // Se cierra la conexión a la base de datos
        await mongoose.connection.close();
    });

    // Prueba: Crear un usuario de forma correcta
    it('Crea un usuario de forma correcta', async function () {
        const { statusCode, ok, _body } = await requester.post('/auth/register').send(userMock);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('status', 'success');
        expect(_body).to.have.property('message', 'User registered successfully');
    });

    // Prueba: Loguear un usuario de forma exitosa y redireccionar a /products
    it('Loguea un usuario en forma exitosa y redirecciona a /products', async function () {
        const { headers, statusCode, ok } = await requester.post('/auth/login').send(userMock);
        expect(statusCode).to.be.equals(302);
        expect(headers).to.have.property('location', '/products');
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
    });

    // Prueba: Obtener el usuario actual con un token válido
    it('Obtiene el usuario actual con un token válido', async function () {
        const { statusCode, ok, _body } = await requester.get('/auth/current').set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('email', userMock.email);
    });

    // Prueba: Obtener el carrito de un usuario
    it('Obtiene el carrito de un usuario', async function () {
        const { statusCode, ok } = await requester.get('/auth/cart').set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
    });

    // Prueba: Obtener un listado de los usuarios
    it('Obtiene un listado de los usuarios', async function () {
        const { statusCode, ok, _body } = await requester.get('/auth/users');
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body)).to.be.equals(true);
    });
});