import express from "express";
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin, authenticate, isPremiumOrAdmin } from "../middlewares/main.js";
export const productsRouter = express.Router()

/*productsRouter.get('/', productsController.getAllProducts)

productsRouter.get('/:pid', productsController.findOne)

productsRouter.delete('/:pid', isAdmin, productsController.delete)

productsRouter.post('/', isAdmin, uploader.single('file'), productsController.create)

productsRouter.put('/:pid', isAdmin, productsController.update)*/

productsRouter.get('/', productsController.getAllProducts);

productsRouter.get('/:pid', productsController.findOne);

productsRouter.delete('/:pid', authenticate, isPremiumOrAdmin, productsController.delete);

productsRouter.post('/', authenticate, isPremiumOrAdmin, uploader.single('file'), productsController.create);

productsRouter.put('/:pid', authenticate, isPremiumOrAdmin, productsController.update);