import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    path: { type: String, required: true },
});
productSchema.plugin(mongoosePaginate)

// Agrega el método para obtener las vistas de productos
productSchema.statics.viewsProducts = async function () {
    try {
        const views = await this.find({}, { path: false, __v: false }).lean();
        return views;
    } catch (error) {
        console.log(error);
        throw new Error("Unable to find the product");
    }
};

export const MongooseProductModel = model("products", productSchema);