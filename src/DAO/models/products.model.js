//products.model.js
import { MongooseProductModel } from "./mongoose/products.mongoose.js";
import logger from "../../utils/logger.js";

class ProductsModel {
    getAllProducts() {
        try {
            let allProds = MongooseProductModel.find({}, { path: false, __v: false, });
            return allProds
        } catch (error) {
            logger.error("Unable to get products", error);
            throw new Error("Unable to get products");
        }
    }

    async paginate({ query, numberPage }) {
        try {
            const pages = await MongooseProductModel.paginate(query, { limit: 3, page: numberPage || 1 })
            return pages
        } catch (error) {
            logger.error("Unable to get products", error);
            throw new Error("Unable to get products");
        }
    }

    async findOne(pid) {
        try {
            const productFinder = await MongooseProductModel.findOne(
                { _id: pid },
                {
                    path: false,
                    __v: false,
                }
            );
            return productFinder;
        } catch (error) {
            logger.error("Unable to find the product", error);
            throw new Error("Unable to find the product");
        }
    }

    async delete(pid) {
        try {
            const productsDeleted = await MongooseProductModel.deleteOne({ _id: pid });
            return productsDeleted;
        } catch (error) {
            logger.error("Unable to delete the product", error);
            throw new Error("Unable to delete the product");
        }
    }

    async create(product) {
        try {
            const createdProduct = await MongooseProductModel.create(product);
            return createdProduct;
        } catch (error) {
            logger.error("Unable to create the product", error);
            throw new Error("Unable to create the product");
        }
    }

    async update({ pid, price, stock, status, rest }) {
        try {
            const updatedProduct = await MongooseProductModel.findOneAndUpdate(
                { _id: pid },
                {
                    $set: {
                        price: Number(price),
                        stock: Number(stock),
                        status: status === 'available',
                        ...rest
                    }
                }
            );
            return updatedProduct;
        } catch (error) {
            logger.error("Unable to update the product", error);
            throw new Error("Unable to update the product");
        }
    }

    async updateOneProd({ pid, quantity }) {
        try {
            await MongooseProductModel.updateOne({ _id: pid }, { $inc: { stock: quantity } });
        } catch (error) {
            logger.error("Unable to get products", error);
            throw new Error("Unable to get products");
        }
    }

    async viewsProducts() {
        try {
            const views = await MongooseProductModel.find({}, {
                path: false,
                __v: false
            }).lean()

            return views;
        } catch (error) {
            logger.error("Unable to find the product", error);
            throw new Error("Unable to find the product");
        }
    }
}

export const ProductsMongo = new ProductsModel()