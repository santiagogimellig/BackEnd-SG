import { Router } from "express";
import ProductManager from "../../dao/product_manager.js";

const router = Router()

router.get('/products', async (req, res)=>{
    const products = await ProductManager.get()
    res.render('home', { products: products.map(p=> p.toJSON()) } )
})

export default router