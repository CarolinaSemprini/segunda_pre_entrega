//carts.service.js
import { ObjectId } from "mongodb";
import { CartsMongo } from "../DAO/models/carts.model.js";
import { Carts } from "../DAO/factory.js";
//import { cartsModel } from "../DAO/models/carts.model.js";
import { prodService } from "./products.service.js";
import config from "../config/config.js";

class CartsService {
    async getAllCarts() {
        try {
            let allCarts = await CartsMongo.getAllCarts(); // Usa CartsMongo en lugar de Carts
            return allCarts;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all carts");
        }
    }

    async findOne(cid) {
        try {
            const cartFinder = await CartsMongo.findOne(cid); // Usa CartsMongo en lugar de Carts
            return cartFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the cart");
        }
    }

    async createProd({ cid, pid }) {
        try {
            const findProdInCart = await CartsMongo.findProdInCart({ cid, pid }); // Usa CartsMongo en lugar de Carts
            if (findProdInCart) {
                if (config.persistence == 'MONGO') {
                    const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));
                    if (productToUpdate) {
                        await CartsMongo.updateOneProd({ cid, pid, inc: 1 }); // Usa CartsMongo en lugar de Carts
                    }
                } else {
                    const productToUpdate = findProdInCart.products.find(product => product.pid._id == pid);
                    if (productToUpdate) {
                        await CartsMongo.updateOneProd({ cid, pid, inc: 1 }); // Usa CartsMongo en lugar de Carts
                    }
                }
            } else {
                await CartsMongo.findCartAndUpdate({ cid, pid, operation: 'push' }); // Usa CartsMongo en lugar de Carts
            }
            const cartToUpdate = await CartsMongo.findOne(cid); // Usa CartsMongo en lugar de Carts
            return cartToUpdate;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    async createCart() {
        const newCart = await CartsMongo.create();
        return newCart
    }

    async deleteProd({ cid, pid }) {
        try {

            const findProdInCart = await CartsMongo.findProdInCart({ cid, pid });
            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product =>
                    config.persistence === 'MONGO' ? product.pid.equals(new ObjectId(pid)) : product.pid._id.toString() === pid
                );

                if (productToUpdate && productToUpdate.quantity > 1) {
                    await CartsMongo.updateOneProd({ cid, pid, inc: -1 });
                } else {
                    await CartsMongo.findCartAndUpdate({ cid, pid, operation: 'pull' });
                }
            }

            const cartToUpdate = await CartsMongo.findOne(cid);
            return cartToUpdate;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

    async deleteCart({ cid }) {
        try {
            const cart = await CartsMongo.findOne(cid);

            cart.products.forEach(async (product) => {

                const pid = product.pid._id;
                const quantity = product.quantity;

                await prodService.updateOneProd({ pid, quantity });
            });
            await CartsMongo.findCartAndUpdate({ cid, pid: null, operation: 'clean' });

            const cartToUpdate = await CartsMongo.findOne(cid);
            return cartToUpdate;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

}

export const cartService = new CartsService()