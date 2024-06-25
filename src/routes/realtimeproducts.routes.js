//realtimeproducts.routes.js
import express from "express"

import { productsController } from "../controllers/products.controller.js";
import { authorize } from "../middlewares/main.js";

export const realTimeProductsRouter = express.Router()

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

realTimeProductsRouter.get('/realtimeproducts', authorize(['admin', 'premium']), productsController.getAllProducts);
