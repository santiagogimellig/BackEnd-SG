// Importo las dependencias necesarias para el controlador de productos
import { response, request } from "express";
import productsService from "../services/products.service.js";

// Defino una clase 'Product' para representar un producto con sus atributos principales
class Product {
    constructor(title, description, price, thumbnail = null, code, stock, status = true, category) {
        // Verifico que los campos obligatorios estén presentes
        if (!title || !description || !price || !code || !stock) {
            throw new Error('Todos los campos principales son obligatorios: title, description, price, code, stock');
        }
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }
}

// Defino la clase del controlador de productos
class ProductsController {
    // Método para obtener productos con opciones de paginación, filtrado y ordenamiento
    getProducts = async (req, res) => {
        try {
            // Defino variables para limitar resultados, paginación, filtros y ordenamiento
            let limit;
            let result;
            let page;
            let sort;
            let query;

            // Configuro límite de productos por página
            if (req.query.limit) {
                limit = parseInt(req.query.limit)
            } else {
                limit = 10
            }

            // Configuro la página actual
            if (req.query.page) {
                page = parseInt(req.query.page)
            } else {
                page = 1
            }

            // Configuro el filtro de búsqueda
            if (req.query.query) {
                query = JSON.parse(req.query.query)
                if (query.status != null || query.category != null || query.stock != null) {
                    query = query
                } else {
                    throw new Error("La consulta no es correcta.")
                }
            } else {
                query = {}
            }

            // Configuro el ordenamiento de los resultados
            if (req.query.sort) {
                sort = req.query.sort
                if (sort == 'asc') {
                    sort = 'price'
                } else if (sort == 'desc') {
                    sort = '-price'
                }
            } else {
                sort = null
            }

            // Parámetros para la consulta de productos
            let params = {
                limit: limit,
                input_page: page,
                query: query,
                sort: sort
            }

            // Realizo la consulta y obtengo los resultados paginados
            result = await productsService.getProducts(params)
            let products = result.docs;

            // Configuro enlaces para la paginación
            let nextLink = null;
            let prevLink = null;
            let host = req.headers.host;

            if (result.hasPrevPage == true) {
                prevLink = 'http://' + host + '/api/products?page=' + result.prevPage
            }

            if (result.hasNextPage == true) {
                nextLink = 'http://' + host + '/api/products?page=' + result.nextPage
            }

            // Devuelvo la respuesta con los resultados paginados y enlaces de paginación
            res.send({
                status: 'Success',
                code: 200,
                payload: products,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            })
        } catch (error) {
            // Manejo de errores en la consulta
            res.status(400).send({ error: error.message });
        }
    };

    // Método para obtener un producto por su ID
    getProductById = async (req, res) => {
        try {
            const idProduct = req.params.idProduct;
            let product = await productsService.getProductById(idProduct)
            let response;
            if (!product) {
                response = {
                    error: "Producto no encontrado."
                }
            } else {
                response = { product }
            }
            res.send(response)
        } catch (error) {
            // Manejo de errores al obtener un producto por ID
            res.status(400).send({ error: error.message });
        }
    }

    // Método para agregar un nuevo producto
    addProduct = async (req, res) => {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        try {
            // Creo una instancia de la clase 'Product' con los datos proporcionados
            let product = new Product(title, description, price, thumbnail, code, stock, status, category);
            // Agrego el producto utilizando el servicio correspondiente
            let products = await productsService.addProduct(product);
            // Devuelvo la respuesta con el producto creado y un mensaje
            res.send({
                data: product,
                message: "Producto creado."
            });
        } catch (error) {
            // Manejo de errores al intentar agregar un producto
            res.status(400).send({ error: error.message });
        }
    }

    // Método para actualizar un producto existente
    updateProduct = async (req, res) => {
        const idProduct = req.params.idProduct;
        const productUpdate = req.body;
        try {
            // Actualizo el producto utilizando el servicio correspondiente
            let products = await productsService.updateProduct(idProduct, productUpdate)
            // Devuelvo la respuesta con los productos actualizados
            res.send({ products })
        } catch (error) {
            // Manejo de errores al intentar actualizar un producto
            res.status(400).send({ error: error.message });
        }
    }

    // Método para eliminar un producto
    deleteProduct = async (req, res) => {
        const idProduct = req.params.idProduct;
        try {
            // Elimino el producto utilizando el servicio correspondiente
            let product_deleted = await productsService.deleteProduct(idProduct)
            // Devuelvo la respuesta con el producto eliminado
            res.send({ product_deleted })
        } catch (error) {
            // Manejo de errores al intentar eliminar un producto
            res.status(400).send({ error: error.message });
        }
    }
}

// Exporto la clase del controlador de productos
export default ProductsController;