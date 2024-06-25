import express from "express";
import { usersController } from "../controllers/users.controller.js";
import { authenticate, isAdmin, isPremiumOrAdmin } from '../middlewares/main.js';

export const usersRouter = express.Router();

usersRouter.get("/", usersController.getAll);

usersRouter.get("/:username", usersController.getOne);

usersRouter.post("/", usersController.create);

usersRouter.put("/:id", usersController.update);

usersRouter.get('/:id', usersController.getById);

usersRouter.put('/:id', authenticate, isPremiumOrAdmin, usersController.update);

usersRouter.delete('/:id', authenticate, isAdmin, usersController.delete);

usersRouter.delete("/:id", usersController.delete);