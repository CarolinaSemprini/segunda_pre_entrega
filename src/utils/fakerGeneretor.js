// Importa la función fakerES desde el paquete "@faker-js/faker" y renómbrala como "faker"
import { fakerES as faker } from "@faker-js/faker";

// Función para generar un usuario ficticio
export const generateUser = () => {
    // Genera un número aleatorio de productos entre 1 y 10
    const numOfProducts = faker.number.int({ min: 1, max: 10 });
    const products = [];

    // Genera productos ficticios y los agrega a un array
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    // Devuelve un objeto que representa un usuario ficticio
    return {
        _id: faker.database.mongodbObjectId(), // Genera un ID de MongoDB
        first_name: faker.person.firstName(), // Genera un nombre ficticio
        last_name: faker.person.lastName(), // Genera un apellido ficticio
        username: faker.internet.userName(), // Genera un nombre de usuario ficticio
        email: faker.internet.email(), // Genera una dirección de correo electrónico ficticia
        age: faker.number.int({ min: 18, max: 99 }).toString(), // Genera una edad ficticia entre 18 y 99 años
        password: faker.internet.password(), // Genera una contraseña ficticia
        role: "user", // Define el rol del usuario como "user"
        cart_ID: faker.database.mongodbObjectId(), // Genera un ID de carrito ficticio
        products, // Asigna el array de productos generados al usuario
    };
};

// Función para generar un producto ficticio
export const generateProduct = () => {
    // Devuelve un objeto que representa un producto ficticio
    return {
        _id: faker.database.mongodbObjectId(), // Genera un ID de MongoDB para el producto
        title: faker.commerce.productName(), // Genera un nombre de producto ficticio
        description: faker.commerce.productDescription(), // Genera una descripción de producto ficticia
        price: faker.commerce.price(), // Genera un precio de producto ficticio
        thumnail: faker.image.url(), // Genera una URL de imagen ficticia para el producto
        code: faker.string.alpha(5).toUpperCase(), // Genera un código de producto ficticio
        stock: faker.number.int(15), // Genera una cantidad de stock ficticia
        category: faker.commerce.department(), // Genera una categoría de producto ficticia
        status: faker.datatype.boolean(), // Genera un estado de producto ficticio (activo o inactivo)
    };
};
