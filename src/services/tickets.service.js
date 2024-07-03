
import TicketDTO from "../DAO/DTO/ticket.dto.js";
import config from '../config/config.js';
import { Tickets, Carts, Users, Products } from "../DAO/factory.js";
import { CartsMongo } from '../DAO/models/carts.model.js';
import { cartService } from "../services/carts.service.js";
import { TicketsMongo } from '../DAO/models/tickets.model.js';
import { UsersMongo } from '../DAO/models/users.model.js';
import { ProductsMongo } from '../DAO/models/products.model.js'

class TicketService {
    async getAll() {
        try {
            let allTickets = await TicketsMongo.getAll()
            return allTickets;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all Tickets");
        }
    }

    async getOne({ tid }) {
        const ticket = await TicketsMongo.getOne({ tid });
        const ticketDTO = new TicketDTO(ticket);

        async function completeProducts(dto) {
            const completedProducts = [];

            for (const product of dto.products) {
                const productData = await ProductsMongo.findOne(product.pid);
                const completedProduct = {
                    pid: productData,
                    amount: product.amount
                };
                completedProducts.push(completedProduct);
            }

            const completedDto = {
                ...dto,
                products: completedProducts
            };

            return completedDto;
        }

        const completeTicket = await completeProducts(ticketDTO);

        return completeTicket;
    }
    async create({ cid, email }) {
        try {
            const code = Date.now() + Math.floor(Math.random() * 10000 + 1);
            const date = new Date()

            const cartFinder = await CartsMongo.findOne(cid)

            if (cartFinder.products.length > 0) {
                const productsPidAmount = cartFinder.products.map(product => ({
                    pid: product.pid._id,
                    amount: product.quantity
                }))

                const totalPrice = cartFinder.products.reduce((total, product) => {
                    return total + (product.quantity * product.pid.price);
                }, 0);

                // Verifica el stock de cada producto antes de crear el ticket
                const insufficientStockProducts = [];
                for (const product of cartFinder.products) {
                    const productData = await ProductsMongo.findOne(product.pid);
                    if (product.quantity > productData.stock) {
                        insufficientStockProducts.push(productData.title);
                    }
                }

                // Si hay productos con stock insuficiente, devuelve un error
                if (insufficientStockProducts.length > 0) {
                    return { error: `Stock insuficiente para los productos: ${insufficientStockProducts.join(', ')}` };
                }

                const ticketCreated = await TicketsMongo.create({ code, date, email, productsPidAmount, totalPrice });

                cartFinder.products.forEach(async (product) => {
                    const quantity = product.quantity;
                    for (let i = 0; i < quantity; i++) {
                        await cartService.deleteProd({ cid: cid, pid: product.pid });
                    }
                });

                await UsersMongo.updateTicketUser({ tid: ticketCreated._id, email })

                return ticketCreated;
            } else { return null }

        } catch (error) {
            console.error('Error creating Ticket:', error);
            throw error;
        }
    }
}

export const ticketService = new TicketService()