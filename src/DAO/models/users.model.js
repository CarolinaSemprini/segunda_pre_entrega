// archivo users.model.js
import { MongooseUserModel } from "./mongoose/users.mongoose.js";
import logger from '../../utils/logger.js';
class UsersModel {
    async getAll() {
        try {
            let allUsers = await MongooseUserModel.find({}, { __v: false });
            return allUsers;
        } catch (error) {
            logger.error("Unable to get users", error);
            throw new Error("Unable to get all users");
        }
    }

    async getOne(username) {
        const users = await MongooseUserModel.findOne({ username: username }, { __v: false });
        return users
    }

    async create({ first_name, last_name, username, email, age, password, cart_ID }) {
        try {
            const userCreated = await MongooseUserModel.create({
                first_name,
                last_name,
                username,
                email,
                age,
                password,
                cart_ID
            }
            );
            return userCreated;
        } catch (error) {
            logger.error("Unable to create the user", error);
            throw error;
        }
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ObjectId');
        }
        const user = await MongooseUserModel.findById(id);
        return user;
    }

    /*async getOne(userId) {
        try {
            const user = await MongooseUserModel.findById(userId, { __v: false });
            return user;
        } catch (error) {
            logger.error("Unable to get user by ID", error);
            throw new Error("Unable to get user by ID");
        }
    }*/

    async getOne(username) {
        const user = await MongooseUserModel.findOne({ username: username }, { __v: false });
        return user;
    }

    async getOneByUsername(username) {
        try {
            const user = await MongooseUserModel.findOne({ username: username });
            return user;
        } catch (error) {
            logger.error("Unable to get user by username", error);
            throw error;
        }
    }

    async update({ id, first_Name, last_Name, email }) {
        const userUpdated = await MongooseUserModel.updateOne(
            { _id: id },
            { first_Name, last_Name, email }
        );
        return userUpdated
    }

    async delete({ id }) {
        const userDeleted = await MongooseUserModel.deleteOne({ _id: id });
        return userDeleted
    }


    //metodos nuevos
    async findOneAndUpdate(query, update) {
        const result = await MongooseUserModel.findOneAndUpdate(query, update, { new: true });
        return result;
    }

    async getOneByEmail(email) {
        const user = await MongooseUserModel.findOne({ email: email });
        return user;
    }


    async updateTicketUser({ tid, email }) {

        await MongooseUserModel.findOneAndUpdate(
            { email: email },
            { $push: { tickets: tid } }
        )

    }
}

export const UsersMongo = new UsersModel()