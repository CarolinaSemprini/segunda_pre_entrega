//realtimeproducts.routessss.js
import express from "express"
import { productsController } from "../controllers/products.controller.js";
import { authenticate, authorize } from "../middlewares/main.js";

export const realTimeProductsRouter = express.Router();

// Ruta para realtimeproducts
realTimeProductsRouter.get('/realtimeproducts', authenticate, authorize(['admin', 'premium']), (req, res) => {
    try {
        return res.status(200).render('realtimeproducts', {});
    } catch (error) {
        return res.status(500).json({ status: 'error', msg: 'Error getting the products' });
    }
});

realTimeProductsRouter.get('/', (req, res) => {
    try {
        return res
            .status(200)
            .render('realtimeproducts', {})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }

})

realTimeProductsRouter.get('/', authenticate, (req, res) => {
    try {
        return res.status(200).render('realtimeproducts', {});
    } catch (error) {
        return res.status(500).json({ status: "error", msg: "Error getting the products" });
    }
});

realTimeProductsRouter.get('/realtimeproducts', authenticate, authorize(['admin', 'premium']), productsController.getAllProducts);
realTimeProductsRouter.get('/realtimeproducts', authorize(['admin', 'premium']), productsController.getAllProducts);
