import express from "express";
import { readFile } from "fs/promises";
import logger from "../utils/logger.js";

const loggerTestRouter = express.Router();

loggerTestRouter.get("/", async (req, res) => {
    try {
        const logFilePath = "./errors.log";
        const content = await readFile(logFilePath, "utf8");

        const logs = content.split("\n").filter(line => line.trim() !== "");

        res.render("loggers", { logs });
    } catch (e) {
        logger.error(e.message);
        res.status(501).send({ status: "error", msg: "Error en el servidor", error: e });
    }
});

// Endpoint para probar todos los niveles de logs
loggerTestRouter.get("/test", (req, res) => {
    logger.debug("Este es un mensaje de depuración (debug)");
    logger.http("Este es un mensaje HTTP (http)");
    logger.info("Este es un mensaje informativo (info)");
    logger.warning("Este es un mensaje de advertencia (warning)");
    logger.error("Este es un mensaje de error (error)");
    logger.fatal("Este es un mensaje fatal (fatal)");

    res.send("Prueba de logger realizada. Revisa la consola y el archivo de logs.");
});

export default loggerTestRouter;