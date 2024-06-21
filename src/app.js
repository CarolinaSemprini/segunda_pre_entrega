//@ts-check
import MongoStore from 'connect-mongo';
import { connectMongo } from './utils/dbConnection.js';
import cookieParser from 'cookie-parser';
import express from "express";
import handlebars from "express-handlebars";
import session from 'express-session';
import passport from 'passport';
import { __dirname } from "./config.js";
import config from './config/config.js';
import { iniPassport } from './config/passport.config.js';
import { authenticate, isAdmin, isUser } from './middlewares/main.js';
import { cartsRouter } from "./routes/carts.routes.js";
import { ChatRouter } from "./routes/chat.routes.js";
import { cookiesRouter } from "./routes/cookies.routes.js";
import { homeRouter } from "./routes/home.routes.js";
import { mockingRouter } from './routes/mocking.routes.js';
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProductsRouter } from "./routes/realtimeproducts.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { loggerTestRouter } from "./routes/loggerTest.routes.js"
import { connectSocketServer } from "./utils/socketServer.js";
import errorHandler from "./middlewares/error.js";
import dotenv from "dotenv";
import logger from './utils/logger.js';
import passwordRecoveryRouter from './routes/passwordRecovery.routes.js'; // Asegúrate de usar 'default' aquí
import bodyParser from 'body-parser';

const app = express();
const PORT = 8080;
dotenv.config();

logger.info("URL de conexión MongoDB:", config.MONGO_URL);

// Middleware para analizar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connectMongo();
const httpServer = app.listen(PORT, () => {
    try {
        logger.info(`URL de conexión MongoDB:`);
        logger.info(`Listening to the port ${PORT}`);
        logger.info(`Acceder a:`);
        logger.info(`1). http://localhost:8080/api/products`);
        logger.info(`2). http://localhost:8080/carts`);
        logger.info(`3). http://localhost:8080/loggerTest`);
        logger.info(`Conectado a DB ecommerce!`);
    } catch (err) {
        logger.error(err);
    }
});

connectMongo();
connectSocketServer(httpServer);

app.use(cookieParser('4lg0s3cr3t0'));

app.use('/auth', passwordRecoveryRouter);

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: config.MONGO_URL,
            ttl: 15 * 60,
        }),
        secret: "asd3ñc30kasod",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 15 * 60 * 1000,
        },
    })
);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", authenticate, productsRouter);
app.use("/api/carts", authenticate, cartsRouter);
app.use("/api/users"/* ,authenticate */, usersRouter);
app.use("/chat", isUser, ChatRouter);
app.use("/home", homeRouter)
app.use("/realtimeproducts", isAdmin, realTimeProductsRouter)
app.use("/views", viewsRouter)
app.use("/cookie", cookiesRouter)
app.use("/api/sessions/", sessionsRouter)
app.use("/", sessionsRouter)
app.use("/mockingproducts", mockingRouter)
app.use(errorHandler)
app.use("/loggerTest", loggerTestRouter);

// Endpoint de prueba de logger
app.get('/loggerTest', (req, res) => {
    logger.debug("Este es un mensaje de depuración (debug)");
    logger.http("Este es un mensaje HTTP (http)");
    logger.info("Este es un mensaje informativo (info)");
    logger.warning("Este es un mensaje de advertencia (warning)");
    logger.error("Este es un mensaje de error (error)");


    res.send("Prueba de logger realizada. Revisa la consola y el archivo de logs.");
});

// Ruta para mostrar el formulario de restablecimiento de contraseña
app.get('/forgot-password', (req, res) => {
    res.render('restablecerPassword'); // Renderizar la vista 'restablecerPassword.handlebars'
});



// Ruta para manejar la página de restablecimiento de contraseña en el frontend
app.get('/reset-password/:token', (req, res) => {
    // Renderizar la plantilla de restablecimiento de contraseña (handlebars)
    res.render('resetPassword', {
        clientUrl: process.env.CLIENT_URL, // Pasar la URL del cliente a la vista
        token: req.params.token, // Pasar el token JWT como parámetro
    });
});


// Endpoint para probar el logger
app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warning('Warning log');
    logger.error('Error log');
    res.send('Logs tested. Check your console or log files.');
});

app.get("*", (req, res) => {
    return res.render('errorLogin', { msg: 'Error link' });
});