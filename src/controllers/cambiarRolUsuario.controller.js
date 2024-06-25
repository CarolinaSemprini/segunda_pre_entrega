//archivo cambiarRolUsuario.controller.js
//import { userService } from '../services/users.service.js';
//import logger from '../utils/logger.js';

/*const changeUserRole = async (req, res) => {
    const userId = req.params.uid;

    try {
        // Obtener el usuario por ID
        const user = await userService.getById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Cambiar el rol del usuario
        const newRole = user.role === 'user' ? 'premium' : 'user';
        const updatedUser = await userService.updateRole(userId, newRole);

        return res.status(200).json({
            status: 'success',
            message: 'User role updated successfully',
            data: updatedUser
        });
    } catch (error) {
        logger.error(`Error changing user role: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};*/

import { userService } from '../services/users.service.js';
import logger from '../utils/logger.js';

export const togglePremium = async (req, res) => {
    const userId = req.params.uid;
    const { firstName, lastName, email, role } = req.body;

    console.log('Received request to change role for userId:', userId, 'to role:', role);

    try {
        // Verificar si el usuario existe
        let user = await userService.getById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Validar que los campos necesarios estén presentes y no estén vacíos
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please complete firstName, lastName and email'
            });
        }

        // Actualizar los datos del usuario
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.role = role;

        // Guardar los cambios en la base de datos
        const updatedUser = await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'User role and details updated successfully',
            data: updatedUser
        });
    } catch (error) {
        logger.error(`Error toggling user role and details: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};