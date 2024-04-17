import express from "express";
import { viewsController } from "../controllers/views.controller.js";

import { ticketsController } from "../controllers/tickets.controller.js";
export const viewsRouter = express.Router()

viewsRouter.get('/products', viewsController.getProducts)

viewsRouter.get('/carts/:cid', viewsController.getCart)

viewsRouter.get('/purchase/:tid', ticketsController.getOne)