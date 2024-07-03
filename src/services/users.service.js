
//import { UsersDAO } from "../DAO/models/users.model.js";
import { MongooseUserModel } from '../DAO/models/mongoose/users.mongoose.js';
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
    async getById(id) {
        try {
            const user = await MongooseUserModel.findById(id);
            return user;
        } catch (error) {
            logger.error(`Error fetching user by ID: ${error.message}`);
            throw error;
        }
    }

    /*async getById(id) {
        try {
            return await UsersMongo.getById(id);
        } catch (error) {
            throw new Error('Unable to get user by ID: ' + error.message);
        }
    }*/

    async getOneByUsername(username) {
        try {
            const user = await UsersMongo.getOneByUsername(username);
            return user;
        } catch (error) {
            logger.error("Unable to get user by username", error);
            throw new Error("Unable to get user by username");
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
        try {
            const userUpdated = await UsersMongo.update({ id, first_name, last_name, email });
            return userUpdated;
        } catch (error) {
            logger.error(`Error updating user: ${error.message}`);
            throw error;
        }
    }

    async updateRole(userId, newRole) {
        try {
            const updatedUser = await MongooseUserModel.findByIdAndUpdate(
                userId,
                { role: newRole },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        } catch (error) {
            logger.error(`Error updating user role: ${error.message}`);
            throw error;
        }
    }


    async delete({ id }) {
        try {
            const userDeleted = await UsersMongo.delete({ id });
            return userDeleted;
        } catch (error) {
            logger.error(`Error deleting user: ${error.message}`);
            throw error;
        }
    }

}


export const userService = new UserService()