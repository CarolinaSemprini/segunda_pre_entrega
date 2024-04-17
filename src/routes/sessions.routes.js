import express from "express";
import { sessionsController } from "../controllers/sessions.controller.js";

export const sessionsRouter = express.Router();

// Ruta para obtener la página principal
sessionsRouter.get('/', sessionsController.get);

// Ruta para obtener la página de registro
sessionsRouter.get('/register', sessionsController.getRegister);

// Ruta para registrar un nuevo usuario
sessionsRouter.post('/register', sessionsController.postRegister);

// Ruta para cerrar sesión
sessionsRouter.get('/logout', sessionsController.getLogout);

// Ruta para obtener la página de perfil actual
sessionsRouter.get('/current', sessionsController.getCurrent);

// Ruta para manejar errores
sessionsRouter.get('/error', sessionsController.getError);
