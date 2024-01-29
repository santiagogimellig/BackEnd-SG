// Importo las funcionalidades necesarias de Express y el controlador de productos
import { Router } from "express";
import ProductsController from "../controllers/products.controllers.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

// Creo una instancia del enrutador de Express y del controlador de productos
const router = Router();
const productsController = new ProductsController();

// Defino las rutas para las operaciones relacionadas con los productos
router.get("/", productsController.getProducts);
router.get("/:idProduct", productsController.getProductById);
router.post("/", adminMiddleware, productsController.addProduct);
router.put("/:idProduct", adminMiddleware, productsController.updateProduct);
router.delete("/:idProduct", adminMiddleware, productsController.deleteProduct);

// Exporto el enrutador configurado con las rutas definidas
export default router;