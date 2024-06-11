// Importa la clase Server de la biblioteca 'socket.io'
import { Server } from "socket.io";

// Importa el modelo MessagesModel desde el archivo '../DAO/models/messages.model.js'
// Importa los servicios cartService y prodService desde los archivos '../services/carts.service.js' y '../services/products.service.js' respectivamente
import { MessagesModel } from "../DAO/models/messages.model.js";
import { cartService } from "../services/carts.service.js";
import { prodService } from "../services/products.service.js";

// Función para conectar el servidor de sockets al servidor HTTP
export function connectSocketServer(httpServer) {
    // Crea una instancia de Server asociada al servidor HTTP proporcionado
    const socketServer = new Server(httpServer);

    // Escucha el evento de conexión de nuevos clientes
    socketServer.on("connection", (socket) => {
        // Maneja el evento 'msg_front_back' enviado por el cliente
        socket.on("msg_front_back", async (msg) => {
            try {
                // Crea un nuevo mensaje en la base de datos utilizando el modelo MessagesModel
                await MessagesModel.create(msg);
            } catch (error) {
                logger.error(`Error creating message: ${error.message}`);
            }

            try {
                // Busca todos los mensajes en la base de datos y los envía a todos los clientes conectados
                const msgs = await MessagesModel.find({});
                socketServer.emit("msg_back_front", msgs);
            } catch (error) {
                logger.error(`Error finding messages: ${error.message}`);
            }
        });
    });

    // Maneja el evento 'prod_front_back' enviado por el cliente
    socketServer.on('connection', (socket) => {
        socket.on('prod_front_back', (allProd) => {
            // Emite todos los productos a todos los clientes conectados
            socketServer.emit('prod_back_front', allProd);
        })
    })

    // Maneja el evento 'viewProd_front_back' enviado por el cliente
    socketServer.on('connection', (socket) => {
        socket.on('viewProd_front_back', async (productId) => {
            // Actualiza la cantidad de un producto en la base de datos y emite el nuevo stock a todos los clientes conectados
            let pid = productId.pid;
            await prodService.updateOneProd({ pid, quantity: -1 });
            const newStock = await prodService.findOne(pid);
            socketServer.emit('viewProd_back_front', newStock);
        });
    })

    // Maneja el evento 'viewCart_front_back' enviado por el cliente
    socketServer.on('connection', (socket) => {
        socket.on('viewCart_front_back', async (IDs) => {
            // Busca el carrito en la base de datos, verifica si un producto está en el carrito y emite los resultados a todos los clientes conectados
            const updateCart = await cartService.findOne(IDs.cid);
            const existsInCart = !updateCart.products.some((data) => data.pid._id.toString() === IDs.pid);
            socketServer.emit('viewCart_back_front', updateCart.products, IDs, existsInCart);
        });
    })

    // Maneja el evento 'increaseCart_front_back' enviado por el cliente
    socketServer.on('connection', (socket) => {
        socket.on('increaseCart_front_back', async (productId) => {
            // Actualiza la cantidad de un producto en la base de datos
            let pid = productId.pid;
            await prodService.updateOneProd({ pid, quantity: -1 });
        });
    })

    // Maneja el evento 'decreaseCart_front_back' enviado por el cliente
    socketServer.on('connection', (socket) => {
        socket.on('decreaseCart_front_back', async (IDs) => {
            // Actualiza la cantidad de un producto en la base de datos y elimina el producto del carrito
            let pid = IDs.pid;
            await prodService.updateOneProd({ pid, quantity: 1 });
            await cartService.deleteProd(IDs.cid, IDs.pid);
        });
    })
}
