// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userService } from '../services/users.service.js';
import logger from '../utils/logger.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided',
        });
    }

    try {
        // Verificar y decodificar el token JWT usando el JWT_SECRET del entorno
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Añadir el usuario decodificado al objeto de solicitud para su uso posterior
        req.user = decoded;

        // Verificar si el usuario existe en la base de datos antes de continuar
        const user = await userService.getById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        next(); // Continuar con la ejecución de la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Unauthorized',
        });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.authenticate(username, password);
    if (user) {
        req.session.user = { _id: user._id, role: user.role };
        return res.status(200).json({ status: 'success', msg: 'Login successful' });
    } else {
        return res.status(401).json({ status: 'error', msg: 'Invalid credentials' });
    }
}