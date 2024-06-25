import express from 'express';
import { togglePremium } from '../controllers/cambiarRolUsuario.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const cambiarRolUsuarioRoutes = express.Router();

// Ruta para cambiar el rol de usuario entre "user" y "premium"
cambiarRolUsuarioRoutes.put('/premium/:uid', authMiddleware, togglePremium);

export default cambiarRolUsuarioRoutes;