import fileSystem from 'fs/promises';

export default class ProductHandler {

    constructor(dataFilePath) {
        this.dataFilePath = dataFilePath;
    }

    async getProducts() {
        try {
            const data = await fileSystem.readFile(this.dataFilePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addNewProduct(newProduct) {
        try {
            const products = await this.getProducts();
            newProduct.id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
            if (this.isValidProduct(newProduct)) {
                products.push(newProduct);
                await fileSystem.writeFile(this.dataFilePath, JSON.stringify(products, null, 2));
                console.log('Producto agregado exitosamente.');
            } else {
                console.log('No se pudo agregar el producto. Todos los campos son obligatorios.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId) || null;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProductById(productId, updatedProductData) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                console.log(`No se encontró el producto con el ID ${productId}.`);
                return false;
            }
            const productToUpdate = products[productIndex];
            const updatedProduct = { ...productToUpdate, ...updatedProductData };
            products.splice(productIndex, 1, updatedProduct);
            await fileSystem.writeFile(this.dataFilePath, JSON.stringify(products, null, 2));
            console.log(`Producto con ID ${productId} actualizado correctamente.`);
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductById(productId) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                console.log('No se encontró el producto con el ID proporcionado.');
                return false;
            }
            products.splice(productIndex, 1);
            await fileSystem.writeFile(this.dataFilePath, JSON.stringify(products, null, 2));
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    isValidProduct(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.code &&
            product.stock &&
            product.thumbnail
        );
    }
}