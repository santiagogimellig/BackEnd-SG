// Importación de módulos necesarios para las pruebas
import { expect } from 'chai'; // Utilizado para realizar afirmaciones en las pruebas
import supertest from 'supertest'; // Utilizado para hacer solicitudes HTTP en las pruebas
import { faker } from '@faker-js/faker'; // Utilizado para generar datos aleatorios para las pruebas
import mongoose from 'mongoose'; // ORM para MongoDB
import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env
import { getNewId } from '../src/helpers/utils.js'; // Función auxiliar para generar un nuevo ID

// Cliente para realizar solicitudes HTTP a la aplicación en pruebas
const requester = supertest('http://localhost:8080');

// Bloque describe que contiene las pruebas del módulo de carritos
describe('Test del modulo de carts', function () {
    // Aumenta el tiempo límite para las pruebas debido a operaciones asincrónicas
    this.timeout(8000);

    // Variables necesarias para las pruebas
    let cookie; // Cookie de autenticación
    let pid; // ID del producto creado
    let cid; // ID del carrito creado

    // Datos de usuario para las pruebas
    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234',
        rol: 'premium'
    };

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

        // Se registra un usuario y se obtiene la cookie de autenticación
        const { headers } = await requester.post('/auth/login').send(userMock);
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };

        // Se obtiene el ID del carrito del usuario autenticado
        const { _body: bodyCurrent } = await requester.get('/auth/current')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        cid = bodyCurrent.cartId;

        // Se crea un producto y se obtiene su ID
        const productMock = {
            title: faker.commerce.productName(),
            description: `${faker.commerce.productName()} = ${faker.lorem.word(5)}`,
            code: getNewId(),
            price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
            stock: faker.number.int({ min: 0, max: 10000 }),
            category: faker.commerce.department()
        };
        const { _body } = await requester.post('/api/products').send(productMock)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        pid = _body._id;
    });

    // Después de ejecutar las pruebas, se limpia el entorno
    after(async function () {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        await mongoose.connection.close();
    });

    // Prueba: Obtener todos los carritos
    it('Obtiene todos los carritos', async function () {
        const { statusCode, ok, _body } = await requester.get('/api/carts');
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body)).to.be.true;
    });

    // Prueba: Obtener un carrito por su ID
    it('Obtiene un carrito por su id', async function () {
        const { _body: response1 } = await requester.get('/auth/current')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        const cid = response1.cartId;
        const { statusCode, _body: response2 } = await requester.get(`/api/carts/${cid}`);
        expect(statusCode).to.be.equals(200);
        expect(response2).to.have.property('_id');
        expect(Array.isArray(response2.products)).to.be.true;
    });

    // Prueba: Agregar un producto al carrito
    it('Agrega un producto al carrito', async function () {
        let productAndQuantity = {
            productId: pid,
            quantity: 4
        };
        const { statusCode, _body } = await requester.post(`/api/carts/${cid}`)
            .set('Cookie', [`${cookie.key}=${cookie.value}`])
            .send(productAndQuantity);
        expect(statusCode).to.be.equals(201);
        expect(_body).to.have.property('products').to.be.ok;
        expect(Array.isArray(_body.products)).to.be.ok;
        expect(_body.products).to.have.length(1);
    });

    // Prueba: Generar una compra
    it('Genera una compra', async function () {
        const { statusCode } = await requester.post(`/api/carts/${cid}/purchase`);
        expect(statusCode).to.be.equals(200);
    });
});