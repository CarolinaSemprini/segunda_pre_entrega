//archivo que se encuentra dentro de la carpeta middlewares, archivo llamado uuthMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userService } from '../services/users.service.js';
import logger from '../utils/logger.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const user = await userService.getById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Unauthorized',
        });
    }
};
