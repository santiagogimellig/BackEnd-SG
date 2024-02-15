// Importo el servicio necesario desde su respectivo archivo.
import ProductsService from "../services/products.service.js";

// Importo la función 'faker' para generar datos de prueba y la función 'getNewId' desde el archivo de utilidades.
import { faker } from '@faker-js/faker';
import { getNewId } from '../helpers/utils.js';

// Exporto la clase 'ProductsController'.
export default class ProductsController {
    // Método estático para obtener productos con un filtro opcional y opciones de paginación.
    static async get(query = {}, paginationOptions = {}) {
        // Extraigo las opciones de paginación del objeto 'paginationOptions' o establezco valores predeterminados.
        const { page = 1, limit = 10, category, sort } = paginationOptions;
        // Construyo las opciones de paginación para la consulta al servicio.
        const options = {
            page,
            limit,
            sort
        }
        // Construyo los criterios de búsqueda para la consulta al servicio.
        const criteria = {};
        if (category) {
            criteria.category = category;
        }
        // Obtengo los productos utilizando el servicio 'ProductsService' con los criterios y opciones de paginación.
        const products = await ProductsService.findAll(query, options);
        // Devuelvo los productos obtenidos.
        return products;
    }

    // Método estático para crear un nuevo producto.
    static async create(data, files) {
        try {
            // Creo un nuevo producto utilizando el servicio 'ProductsService'.
            const product = await ProductsService.create({ data, files });
            // Devuelvo el producto creado.
            return product;
        } catch (error) {
            console.error("Error", error.message);
        }
    }

    // Método estático para crear productos falsos para pruebas.
    static async createFakeProduct(productsQuantity) {
        // Itero para crear la cantidad especificada de productos falsos.
        for (let i = 0; i < productsQuantity; i++) {
            // Genero datos aleatorios para el producto utilizando 'faker'.
            let productCategory = faker.commerce.department();
            let productTitle = faker.commerce.productName();
            let productDescription = `${productTitle} - ${faker.lorem.words(5)}`;
            let newProduct = {
                title: productTitle,
                description: productDescription,
                code: getNewId(),
                price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
                status: true,
                stock: faker.number.int({ min: 0, max: 10000 }),
                category: productCategory,
            }
            // Creo el nuevo producto utilizando el servicio 'ProductsService'.
            await ProductsService.create({ data: newProduct });
        }
    }

    // Método estático para obtener un producto por su ID.
    static async getById(pid) {
        // Obtengo el producto por su ID utilizando el servicio 'ProductsService'.
        const product = await ProductsService.findById(pid);
        // Si el producto no existe, lanzo un error.
        if (!product) {
            throw new Error(`Id de producto no encontrado ${pid}`);
        }
        // Devuelvo el producto obtenido.
        return product;
    }

    // Método estático para actualizar un producto por su ID.
    static async updateById(pid, data) {
        // Verifico si el producto existe por su ID.
        await ProductsController.getById(pid);
        console.log('Actualizando el producto');
        // Actualizo el producto utilizando el servicio 'ProductsService'.
        await ProductsService.updateById(pid, data);
        console.log("Producto actualizado correctamente");
    }

    // Método estático para eliminar un producto por su ID.
    static async deleteById(pid) {
        // Verifico si el producto existe por su ID.
        await ProductsController.getById(pid);
        console.log("Eliminando producto");
        // Elimino el producto por su ID utilizando el servicio 'ProductsService'.
        await ProductsService.deleteById(pid);
        console.log("Producto eliminado correctamente");
    }
}