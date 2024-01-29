// Importo las dependencias necesarias para el controlador de productos
import { response, request } from "express";
import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid';
import TicketModel from "../dao/models/ticket.model.js";
import { sendMessage } from "../messages/sms/twilio.js"
import { ticketConfirmation } from '../messages/email/nodemailer.js';

// Defino una clase 'Cart' para representar un carrito de compras
class Cart {
    constructor(products = []) {
        this.products = products;
    }
}

// Defino la clase del controlador de productos
class ProductsController {
    // Método para obtener carritos, con la opción de aplicar un límite
    getCarts = async (req, res) => {
        let limit;
        let carts = await cartsService.getCarts()
        if (req.query.limit) {
            limit = req.query.limit
            carts = carts.slice(0, limit)
        }
        res.send({
            carts
        })
    };

    // Método para agregar un carrito
    addCart = async (req, res) => {
        const { products } = req.body;
        try {
            let cart = new Cart(products);
            let carts = await cartsService.addCart(cart);
            res.send({
                carts
            });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    // Método para obtener productos en un carrito por su ID
    getCartById = async (req, res) => {
        const idcart = req.params.idcart;
        let cart = await cartsService.getCartById(idcart)
        let products = cart.products
        let response;
        if (!cart) {
            response = {
                error: "Carrito no encontrado."
            }
            res.status(400).send(response)
        } else {
            res.send({ products })
        }
    }

    // Método para agregar un producto a un carrito
    addProductInCart = async (req, res) => {
        const idcart = req.params.idcart;
        const idproduct = req.params.idproduct;
        try {
            let carts = await cartsService.addProductInCart(idcart, idproduct)
            res.send(carts)
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    }

    // Método para actualizar la cantidad de un producto en un carrito
    updateProductInCart = async (req, res) => {
        const idcart = req.params.idcart;
        const idproduct = req.params.idproduct;
        const quantity = req.body.quantity;
        try {
            let carts = await cartsService.updateProductInCart(idcart, idproduct, quantity)
            res.send(carts)
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    }

    // Método para eliminar un producto de un carrito
    deleteProductInCart = async (req, res) => {
        const idcart = req.params.idcart;
        const idproduct = req.params.idproduct;
        try {
            let carts = await cartsService.deleteProductInCart(idcart, idproduct)
            res.send(carts)
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    }

    // Método para eliminar un carrito
    deleteCart = async (req, res) => {
        const idcart = req.params.idcart;
        try {
            let carts = await cartsService.deleteCart(idcart)
            res.send({ carts })
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    // Método para actualizar un carrito
    updateCart = async (req, res) => {
        const idcart = req.params.idcart;
        const newProducts = req.body;
        try {
            let carts = await cartsService.updateCart(idcart, newProducts)
            res.send({ carts })
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    // Método para realizar una compra a partir de un carrito
    purchaseCart = async (req, res) => {
        try {
            const cartId = req.params.idcart;
            const email = req.body.email;
            const cart = await cartsService.getCartById(cartId);
            if (cart) {
                if (!cart.products.length) {
                    return res.send("Por favor, añade tus productos antes de generar la compra.")
                }
                const ticketProducts = [];
                const rejectedProducts = [];
                for (let i = 0; i < cart.products.length; i++) {
                    const cartProduct = cart.products[i];
                    const productDB = await productsService.getProductById(cartProduct.product._id);
                    if (cartProduct.quantity <= productDB.stock) {
                        await cartsService.deleteProductInCart(cartId, cartProduct.product._id.toString())
                        ticketProducts.push(cartProduct);
                    } else {
                        rejectedProducts.push(cartProduct);
                    }
                }

                // Creo un nuevo ticket con la información de la compra
                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleString(),
                    amount: 500, // Por definir el monto
                    purchaser: email,
                    products: ticketProducts
                }
                
                // Guardo el ticket en la base de datos
                const ticketCreated = await TicketModel.create(newTicket);

                // Envío mensajes de confirmación por SMS y correo electrónico
                let messageTicketConfirmation = `El ticket con tu compra ${newTicket.code} se creó exitosamente en ${newTicket.purchase_datetime}!`
                await ticketConfirmation(email, messageTicketConfirmation)
                
                // Devuelvo el ticket creado como respuesta
                res.send(ticketCreated)
            } else {
                res.send("El carrito no existe.")
            }
        } catch (error) {
            res.send(error.message)
        }
    }
}

// Exporto la clase del controlador de productos
export default ProductsController;