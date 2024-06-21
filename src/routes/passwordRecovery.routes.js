import express from 'express';
import { sendResetPasswordEmail, resetPassword } from '../controllers/passwordRecovery.controller.js'; // Asegúrate de usar '.js' al final

export const passwordRecoveryRouter = express.Router();

// Ruta para mostrar el formulario de solicitud de restablecimiento de contraseña
passwordRecoveryRouter.get('/forgot-password', (req, res) => {
    res.render('forgotPasswordForm');
});

// Ruta para enviar la solicitud de recuperación de contraseña
passwordRecoveryRouter.post('/forgot-password', sendResetPasswordEmail);

// Ruta para restablecer la contraseña utilizando el token JWT
passwordRecoveryRouter.post('/reset-password/:token', resetPassword);

export default passwordRecoveryRouter;
