// Importo el servicio necesario desde un archivo local
import ProductsService from "../services/products.service.js";
import { faker } from '@faker-js/faker'; // Importo faker para generar datos ficticios

// Defino y exporto la clase ProductsController
export default class ProductsController {
    // Método estático para obtener productos
    static async get(query = {}, paginationOptions = {}) {
        // Obtengo las opciones de paginación y filtrado
        const { page = 1, limit = 10, category, sort } = paginationOptions;
        const options = {
            page,
            limit,
            sort
        }
        const criteria = {};
        if (category) {
            criteria.category = category; // Agrego el filtro por categoría si está presente
        }
        // Obtengo los productos utilizando el servicio de productos
        const products = await ProductsService.findAll(query, options)
        return products; // Devuelvo los productos obtenidos
    }

    // Método estático para crear un producto
    static async create(data, files) {
        try {
            // Creo un nuevo producto utilizando los datos proporcionados y el servicio de productos
            const product = await ProductsService.create({ data, files })
            return product; // Devuelvo el producto creado
        } catch (error) {
            console.error("Error", error.message); // Manejo de errores
        }
    }

    // Método estático para crear un producto ficticio
    static async createFakeProduct(productsQuantity) {
        // Genero productos ficticios utilizando faker
        for (let i = 0; i < productsQuantity; i++) {
            let productCategory = faker.commerce.department();
            let productTitle = faker.commerce.productName();
            let productDescription = `${productTitle} - ${faker.lorem.words(5)}`;
            let newProduct = {
                title: productTitle,
                description: productDescription,
                code: getNewId(), // Supongo que getNewId() genera un nuevo ID para el producto
                price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
                status: true,
                stock: faker.number.int({ min: 0, max: 10000 }),
                category: productCategory,
            }
            // Creo el producto ficticio utilizando el servicio de productos
            await ProductsService.create({ data: newProduct })
        }
    }

    // Método estático para obtener un producto por su ID
    static async getById(pid) {
        // Obtengo el producto por su ID utilizando el servicio de productos
        const product = await ProductsService.findById(pid)
        if (!product) {
            throw new Error(`ID de producto no encontrado: ${pid}`); // Manejo de errores si el producto no existe
        }
        return product; // Devuelvo el producto obtenido
    }

    // Método estático para actualizar un producto por su ID
    static async updateById(pid, data) {
        await ProductsController.getById(pid); // Verifico si el producto existe
        console.log('Actualizando el producto');
        // Actualizo el producto utilizando el servicio de productos
        await ProductsService.updateById(pid, data);
        console.log("Producto actualizado correctamente");
    }

    // Método estático para eliminar un producto por su ID
    static async deleteById(pid) {
        await ProductsController.getById(pid); // Verifico si el producto existe
        console.log("Eliminando producto...");
        // Elimino el producto utilizando el servicio de productos
        await ProductsService.deleteById(pid);
        console.log("Producto eliminado correctamente");
    }
}