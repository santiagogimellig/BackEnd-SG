import ProductModel from '../models/product_model.js';
import { Exception } from '../utils.js';

export default class ProductManager {
    constructor() {
        console.log('Creando una instancia de gestor de productos');
    }

    static async getProducts(query = {}, options) {
        options.lean = true;
        const products = await ProductModel.paginate(query, options);
        return ({
            items: products.docs,
            totalPageCount: products.totalPages,
            previousPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            hasPreviousPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPageLink: products.hasPrevPage ? `/productos?page=${products.prevPage}` : null,
            nextPageLink: products.hasNextPage ? `/productos?page=${products.nextPage}` : null,
        });
    }

    static async getProductById(productId) {
        const product = await ProductModel.findById(productId).lean();
        if (!product) {
            throw new Exception('El producto solicitado no existe', 404);
        }
        return product;
    }

    static async createProduct(data) {
        const createdProduct = await ProductModel.create(data);
        console.log('Producto creado exitosamente');
        return createdProduct;
    }

    static async updateProductById(productId, newData) {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, newData, { new: true });
        console.log('Producto actualizado correctamente');
        return updatedProduct;
    }

    static async deleteProductById(productId) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Exception('El producto que intenta eliminar no existe', 404);
        }
        const deletionCriteria = { _id: productId };
        await ProductModel.deleteOne(deletionCriteria);
        console.log('Producto eliminado correctamente');
    }
    static async addProduct(productData) {
		try {
			productData.category = productData.category.toLowerCase()
			await ProductModel.create(productData)
		}
		catch (error) {
			if (error.code === 11000) {
				throw new Exception(`Product with code "${productData.code}" already exists. code must be unique`, 409)
			}
			throw new Exception("Product data is not valid", 400)
		}
    }
    static async createProduct(product){
        const { title, description, code, price, status, stock, category, thumbnails} = product;

        try {
            const newProduct = new ProductModel({ title, description, code, price, status, stock, category, thumbnails });
            const createdProduct = await newProduct.save();
            console.log('Producto creado con éxito');
            return createdProduct;
        } catch (error) {
            throw new Exception(`Error al crear el producto: ${error.message}`, 500);
        }
    }
}