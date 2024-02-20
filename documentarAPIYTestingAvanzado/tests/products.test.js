// Importación de módulos necesarios para las pruebas
import { expect } from 'chai'; // Utilizado para realizar afirmaciones en las pruebas
import supertest from 'supertest'; // Utilizado para hacer solicitudes HTTP en las pruebas
import { faker } from '@faker-js/faker'; // Utilizado para generar datos aleatorios para las pruebas
import { getNewId } from '../src/helpers/utils.js'; // Función auxiliar para generar un nuevo ID
import mongoose from 'mongoose'; // ORM para MongoDB
import config from '../src/config.js'; // Archivo de configuración
import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env

// Cliente para realizar solicitudes HTTP a la aplicación en pruebas
const requester = supertest('http://localhost:8080');

// Bloque describe que contiene las pruebas del módulo de productos
describe('Tests del modulo products', function () {
    // Aumenta el tiempo límite para las pruebas debido a operaciones asincrónicas
    this.timeout(8000);
    // Variable necesaria para las pruebas
    let cookie; // Cookie de autenticación
    // Datos de usuario para las pruebas
    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234',
        rol: 'admin'
    };

    // Antes de ejecutar las pruebas, se prepara el entorno
    before(async function () {
        // Conexión a la base de datos de prueba
        await mongoose.connect(process.env.DB_MONGO_ATLAS_TEST);
        // Se eliminan todos los datos de las colecciones de la base de datos
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        // Se registra un usuario y se obtiene la cookie de autenticación
        const { headers } = await requester.post('/auth/login').send(userMock);
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
    });

    // Después de ejecutar las pruebas, se limpia el entorno
    after(async function () {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        await mongoose.connection.close();
    });

    // Prueba: Crear un producto correctamente
    it('Debe crear un producto correctamente', async function () {
        const productMock = {
            title: faker.commerce.productName(),
            description: `${faker.commerce.productName()} = ${faker.lorem.word(5)}`,
            code: getNewId(),
            price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
            stock: faker.number.int({ min: 0, max: 10000 }),
            category: faker.commerce.department()
        };
        const { statusCode, ok, _body } = await requester.post('/api/products').send(productMock)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('_id');
    });

    // Prueba: Obtener la lista de productos
    it('Obtiene la lista de productos', async function () {
        const { statusCode, ok, _body } = await requester.get('/api/products')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body.docs)).to.be.ok;
        expect(_body.docs).to.have.length(1);
    });

    // Prueba: Obtener un producto por su ID
    it('Obtiene un producto por su id', async function () {
        let { _body: firstResponseBody } = await requester.get('/api/products')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        const pid = firstResponseBody.docs[0]._id;
        const { statusCode, ok } = await requester.get(`/api/products/${pid}`)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
    });

    // Prueba: Crear 5 productos mock
    it('Crea 5 productos Mocking', async function () {
        const { statusCode, ok, _body } = await requester.post('/api/products/mockingproducts')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('message', 'Productos creados');
    });
});