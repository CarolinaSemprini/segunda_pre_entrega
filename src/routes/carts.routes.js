import express from "express";
import { cartController } from "../controllers/carts.controller.js";
import { ticketsController } from "../controllers/tickets.controller.js";
import { isAdmin, isPremiumOrAdmin, authenticate, authorize } from "../middlewares/main.js";

export const cartsRouter = express.Router();

// Middleware de autorización para roles específicos
const authorizeAdminOrPremium = authorize(['admin', 'premium']);
const authorizeAllRoles = authorize(['user', 'admin', 'premium']);

// Rutas protegidas para operaciones de carrito
cartsRouter.get('/', authenticate, authorizeAllRoles, cartController.getAllCarts);
cartsRouter.get('/:cid', authenticate, authorizeAllRoles, cartController.findOne);
cartsRouter.post('/:cid/product/:pid', authenticate, authorizeAdminOrPremium, cartController.createProd);
cartsRouter.post('/', authenticate, authorizeAllRoles, cartController.createCart);
cartsRouter.delete('/:cid/product/:pid', authenticate, authorizeAllRoles, cartController.deleteProd);
cartsRouter.delete('/:cid', authenticate, authorizeAllRoles, cartController.deleteCart);

// Ruta para crear un ticket a partir del carrito
cartsRouter.post('/:cid/purchase', authenticate, authorizeAllRoles, ticketsController.create);

// Ejemplo de ruta protegida solo para admin
cartsRouter.get('/purchase', authenticate, isAdmin, ticketsController.getAll);
