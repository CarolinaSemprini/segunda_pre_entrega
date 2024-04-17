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
import { connectSocketServer } from "./utils/socketServer.js";
import errorHandler from "./middlewares/error.js";
import dotenv from "dotenv"

const app = express();
dotenv.config();

console.log("URL de conexión MongoDB:", config.MONGO_URL);

//connectMongo();
const httpServer = app.listen(config.PORT, () => {
    console.log(
        `APP corriendo en ${__dirname} - escuchando en el servidor puerto http://localhost:${config.PORT}`
    );
});

connectMongo();
connectSocketServer(httpServer);

//app.use(cookieParser('4lg0s3cr3t0'));

/*app.use(
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
);*/

/*iniPassport();
app.use(passport.initialize());
app.use(passport.session());*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/chat", ChatRouter);
app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/views", viewsRouter);
app.use("/cookie", cookiesRouter);
app.use("/mockingproducts", mockingRouter);
app.use(errorHandler);

app.get("*", (req, res) => {
    return res.render('errorLogin', { msg: 'Error link' });
});
