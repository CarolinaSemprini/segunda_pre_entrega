//archivo mailer.js dentro de la carpeta utils
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendPasswordResetEmail = (to, link) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject: 'Recuperación de contraseña',
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${link}">Restablecer contraseña</a>`
    };

    return transporter.sendMail(mailOptions);
};

