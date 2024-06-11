//import { cartsModel } from "../DAO/models/carts.model.js";
//import { UsersDAO } from "../DAO/models/users.model.js";
import { Users, Carts } from "../DAO/factory.js";
import { createHash } from "../utils/hash.js";
import { UsersMongo } from "../DAO/models/users.model.js";
import { CartsMongo } from "../DAO/models/carts.model.js";

class UserService {
    async getAll() {
        try {
            // Llamamos al método getAll de UsersMongo para obtener todos los usuarios
            let allUsers = await UsersMongo.getAll();
            return allUsers;
        } catch (error) {
            console.log(error);
            throw new Error("No se pueden obtener todos los usuarios");
        }
    }

    async getOne(username) {
        const user = await UsersMongo.getOne(username);
        return user
    }
    async getOneByEmail(email) {
        const user = await UsersMongo.getOneByEmail(email);
        return user;
    }

    async create({ first_name, last_name, username, email, age, password }) {
        try {
            const findUser = await UsersMongo.getOneByEmail(email);

            if (findUser) {
                return false;
            } else {
                const newCart = await CartsMongo.createCart();

                const userCreated = await UsersMongo.create({
                    first_name,
                    last_name,
                    username,
                    email,
                    age,

                    first_name,
                    last_name,
                    username,

                    password: createHash(password),
                    cart_ID: newCart._id
                });
                return userCreated;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update({ id, first_name, last_name, email }) {
        const userUpdated = await UsersMongo.update({ id, first_name, last_name, email })
        return userUpdated
    }

    async delete({ id }) {
        const userDeleted = await UsersMongo.delete({ id });
        return userDeleted
    }
}

export const userService = new UserService()