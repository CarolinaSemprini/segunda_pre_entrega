//products.routes.js
import express from "express";
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin, authenticate, isPremiumOrAdmin, isPremium } from "../middlewares/main.js";
export const productsRouter = express.Router()

/*productsRouter.get('/', productsController.getAllProducts)

productsRouter.get('/:pid', productsController.findOne)

productsRouter.delete('/:pid', isAdmin, productsController.delete)

productsRouter.post('/', isAdmin, uploader.single('file'), productsController.create)

productsRouter.put('/:pid', isAdmin, productsController.update)*/
// Ruta para realtimeproducts
// Ruta para realtimeproducts
productsRouter.get('/realtimeproducts', authenticate, isPremium, (req, res) => {
    try {
        return res.status(200).render('realtimeproducts', {});
    } catch (error) {
        return res.status(500).json({ status: 'error' });
    }
});


//productsRouter.get('/realtimeproducts', isPremium, productsController.realTimeProducts);

productsRouter.get('/', productsController.getAllProducts);

productsRouter.get('/:pid', productsController.findOne);

productsRouter.delete('/:pid', authenticate, isPremiumOrAdmin, productsController.delete);

productsRouter.post('/', authenticate, isPremiumOrAdmin, uploader.single('file'), productsController.create);

productsRouter.put('/:pid', authenticate, isPremiumOrAdmin, productsController.update);