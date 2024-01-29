// Importo el DAO de productos basado en memoria y el modelo de carritos de la base de datos
import productsDaoMemory from "./products.dao.js";
import cartModel from "./models/carts.model.js";

// Clase CartsDaoMemory que implementa operaciones CRUD para la colección de carritos
class CartsDaoMemory {
    
    // Método para eliminar un producto de un carrito
    deleteProductInCart = async (id_cart, id_product) => {
        // Busco el carrito por su ID en la base de datos
        let cart_found = await cartModel.find({ _id: id_cart })
        
        // Verifico si el carrito existe
        if (!cart_found[0]) {
            throw Error('El Carrito no existe.');
        } else {
            // Obtengo la lista de productos en el carrito
            let productsInCart = cart_found[0].products;
            
            // Busco el índice del producto en la lista
            const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
            
            // Verifico si el producto existe en el carrito
            if (productIndex !== -1) {
                // Elimino el producto de la lista
                productsInCart.splice(productIndex, 1);
            } else {
                throw Error('El producto no existe en el carrito.');
            }
            
            // Actualizo la lista de productos en el carrito en la base de datos
            await cartModel.updateOne({ _id: id_cart }, { $set: { products: productsInCart } });
            
            // Obtengo y retorno el carrito actualizado
            let cart = await cartModel.find({ _id: id_cart });
            return cart;
        }
    }
    
    // Método para añadir un producto a un carrito
    addProductInCart = async (id_cart, id_product) => {
        // Verifico si el producto existe en la base de datos de productos
        const productExists = await productsDaoMemory.getProductById(id_product)
        
        // Si el producto no existe, lanzo un error
        if (!productExists) {
            throw Error('El Producto no existe.');
        } else {
            // Busco el carrito por su ID en la base de datos
            let cart_found = await cartModel.find({ _id: id_cart })
            
            // Verifico si el carrito existe
            if (!cart_found[0]) {
                throw Error('El Carrito no existe.');
            } else {
                // Obtengo la lista de productos en el carrito
                let productsInCart = cart_found[0].products;
                
                // Busco el índice del producto en la lista
                const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
                
                // Si el producto ya está en el carrito, aumento la cantidad
                if (productIndex !== -1) {
                    productsInCart[productIndex].quantity = productsInCart[productIndex].quantity + 1;
                } else {
                    // Si el producto no está en el carrito, lo añado a la lista con cantidad 1
                    let product = {
                        product: id_product,
                        quantity: 1
                    };
                    productsInCart.push(product);
                }
                
                // Actualizo la lista de productos en el carrito en la base de datos
                await cartModel.updateOne({ _id: id_cart }, { $set: { products: productsInCart } });
                
                // Obtengo y retorno el carrito actualizado
                let cart = await cartModel.find({ _id: id_cart });
                return cart;
            }
        }
    }

    // Método para actualizar la cantidad de un producto en un carrito
    updateProductInCart = async (id_cart, id_product, quantity) => {
        // Verifico si el producto existe en la base de datos de productos
        const productExists = await productsDaoMemory.getProductById(id_product)
        
        // Si el producto no existe, lanzo un error
        if (!productExists) {
            throw Error('El Producto no existe.');
        } else {
            // Busco el carrito por su ID en la base de datos
            let cart_found = await cartModel.find({ _id: id_cart })
            
            // Verifico si el carrito existe
            if (!cart_found[0]) {
                throw Error('El Carrito no existe.');
            } else {
                // Obtengo la lista de productos en el carrito
                let productsInCart = cart_found[0].products;
                
                // Busco el índice del producto en la lista
                const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
                
                // Si el producto está en el carrito, actualizo la cantidad
                if (productIndex !== -1) {
                    productsInCart[productIndex].quantity = quantity;
                } else {
                    // Si el producto no está en el carrito, lanzo un error
                    throw Error('El producto no existe en el carrito.');
                }
                
                // Actualizo la lista de productos en el carrito en la base de datos
                await cartModel.updateOne({ _id: id_cart }, { $set: { products: productsInCart } });
                
                // Obtengo y retorno la lista actualizada de carritos
                let carts = this.getCarts();
                return carts;
            }
        }
    }
    
    // Método para obtener todos los carritos
    getCarts = async () => {
        // Busco todos los carritos en la base de datos
        const carts = await cartModel.find();
        return carts;
    }

    // Método para añadir un nuevo carrito
    addCart = async (cart) => {
        // Creo un nuevo carrito en la base de datos
        await cartModel.create(cart);
        
        // Obtengo y retorno la lista actualizada de carritos
        let carts = await this.getCarts();
        return carts;
    }

    // Método para obtener un carrito por su ID
    getCartById = async (id_cart) => {
        // Busco el carrito por su ID en la base de datos y populo la referencia a los productos
        let cart_found = await cartModel.find({ _id: id_cart }).populate('products.product')
        
        // Verifico si el carrito existe
        if (cart_found[0]) {
            return cart_found[0];
        } else {
            return;
        }
    }

    // Método para actualizar un carrito con nuevos productos
    updateCart = async (id_cart, newProducts) => {
        // Obtengo la lista actualizada de carritos
        let carts = await this.getCarts();
        
        // Busco el carrito por su ID en la base de datos
        let cart_found = await cartModel.find({ _id: id_cart })
        
        // Verifico si el carrito existe
        if (cart_found) {
            // Actualizo la lista de productos en el carrito en la base de datos
            let result = await cartModel.updateOne({ _id: id_cart }, { $set: { products: newProducts } })
            
            // Obtengo y retorno la lista actualizada de carritos
            carts = this.getCarts();
            return carts;
        } else {
            return 'Error en la operación de actualización. Carrito no encontrado.'
        }
    }

    // Método para eliminar un carrito por su ID
    deleteCart = async (id_cart) => {
        // Busco el carrito por su ID en la base de datos
        let cart_found = await cartModel.find({ _id: id_cart })
        
        // Verifico si el carrito existe
        if (cart_found.length != 0) {
            // Creo una lista vacía de productos y actualizo el carrito en la base de datos
            let productsInCart = [];
            await cartModel.updateOne({ _id: id_cart }, { $set: { products: productsInCart } });
            
            // Obtengo y retorno la lista actualizada de carritos
            let carts = this.getCarts();
            return carts;
        } else {
            // Lanzo un error si el carrito no se encuentra
            throw new Error('Error en la operación de eliminación. Carrito no encontrado.');
        }
    }
}

// Exporto una instancia única de la clase CartsDaoMemory para su uso en otras partes de la aplicación
export default new CartsDaoMemory();