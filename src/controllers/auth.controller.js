import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userService } from '../services/users.service.js';
import logger from '../utils/logger.js';

dotenv.config();

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.authenticate(email, password);
        if (user) {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ status: 'success', token });
        } else {
            return res.status(401).json({ status: 'error', msg: 'Invalid credentials' });
        }
    } catch (error) {
        logger.error(`Error during login: ${error.message}`);
        return res.status(500).json({ status: 'error', msg: 'Internal server error' });
    }
};
