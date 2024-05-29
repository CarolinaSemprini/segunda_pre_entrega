import { connect } from "mongoose";
import config from "../config/config.js";

export async function connectMongo() {
    try {
        await connect(config.MONGO_URL);
        console.log("Conectado a DB ecommerce!");
    } catch (e) {
        console.log(e);
        throw "Error no se pudo conectar ";
    }
}