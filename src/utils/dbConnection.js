import { connect } from "mongoose";
import config from "../config/config.js";
import logger from './logger.js';
export async function connectMongo() {
    try {
        await connect(config.MONGO_URL);
        console.log("Conectado a DB ecommerce!");
    } catch (e) {
        logger.error("no se pudo conectar a DB ecommerce", error);
        throw "Error no se pudo conectar ";
    }
}