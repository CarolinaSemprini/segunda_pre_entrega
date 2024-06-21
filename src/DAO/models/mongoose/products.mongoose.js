import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


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
    owner: { type: Schema.Types.ObjectId, ref: 'users', default: null }
});
productSchema.plugin(mongoosePaginate)
export const MongooseProductModel = model("products", productSchema);