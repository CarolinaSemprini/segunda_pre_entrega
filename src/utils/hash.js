// Importa la función `bcrypt` desde el paquete 'bcrypt'
import bcrypt from 'bcrypt';

// Función para crear un hash de una contraseña
export const createHash = (password) => {
    // bcrypt.hashSync() genera un hash sincrónico de la contraseña proporcionada
    // bcrypt.genSaltSync(10) genera un salt (valor aleatorio) para el hash, con un coste de 10
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Función para validar una contraseña
export const isValidPassword = (password, hashPassword) => {
    // bcrypt.compareSync() compara la contraseña proporcionada con el hash almacenado
    // Devuelve true si la contraseña coincide con el hash, de lo contrario, devuelve false
    return bcrypt.compareSync(password, hashPassword);
};
