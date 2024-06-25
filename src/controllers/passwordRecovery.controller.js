//archivo passwordRecovery.controller.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongooseUserModel as User } from '../DAO/models/mongoose/users.mongoose.js'; // Asegúrate de usar '.js' al final


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

// Función para enviar el correo de restablecimiento de contraseña
export const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar al usuario por su email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        // Generar token JWT con el userId y enviar correo
        //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
        // Generar token JWT con el userId y enviar correo
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Recuperación de contraseña',
            html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${link}">Restablecer contraseña</a>`
        };

        await transporter.sendMail(mailOptions);
        res.send('Correo enviado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar el correo');
    }
};

// Función para restablecer la contraseña
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Decodificar el token JWT para obtener el userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        // Comparar la nueva contraseña con la antigua y actualizarla si es diferente
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send('La nueva contraseña no puede ser igual a la antigua');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send('Contraseña restablecida');
    } catch (error) {
        console.error(error);
        res.status(400).send('Enlace inválido o expirado');
    }
};

//lo que esta faltando es crear el acceso para restablecer la contraseña, hasta aqui el correo se envia perfectamente, pero hay
//que vincular el correo con el restablecimiento de la contraseña, seguramente actualizar la contraseña
// tambien queda pendiente lo de la ruta para productos segun el rol del usuario