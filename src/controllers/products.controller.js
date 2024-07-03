//products.controller.js
import { prodService } from "../services/products.service.js";
import { userService } from "../services/users.service.js";
import { usersController } from "./users.controller.js";

class ProductsController {
    getAllProducts = async (req, res) => {
        try {
            const { limit, sort, page, category, stock } = req.query;

            let parsedLimit = parseInt(limit);
            let parsedPage = parseInt(page);

            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                parsedLimit = 10;
            }

            if (parsedLimit) {
                let limitProd = await prodService.getAllProducts(req, parsedLimit, sort, parsedPage, category, stock);
                return res.status(200).json({ status: "success", msg: 'limited number of products', payload: limitProd });
            } else {
                return res.status(400).json({ status: "error", msg: 'invalid limit parameter' });
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: "Error getting the products" })
        }
    }

    findOne = async (req, res) => {
        try {
            const pid = req.params.pid
            const productFinder = await prodService.findOne(pid)
            if (productFinder) {
                return res
                    .status(201).
                    json({ status: "success", msg: 'Product found', payload: productFinder })
            }
            else {
                return res
                    .status(400).
                    json({ status: "error", msg: 'product not found' })
            }
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'the product could not be found', error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
            const pid = req.params.pid
            const deletedProduct = await prodService.delete(pid)
            return res
                .status(200).
                json({ status: "success", msg: 'removed product', payload: deletedProduct })
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'could not delete product', error: error.message });
        }
    }

    /*create = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ status: "error", msg: 'Sube un archivo para modificar el producto' });
            }

            const name = req.file.filename;
            let owner = "admin"; // Por defecto, asumimos que el propietario es admin

            // Verificar si el usuario es premium
            const user = await userService.getById(req.session.user._id);
            if (user.role === 'premium') {
                owner = user.email; // Si es premium, establecer el propietario como su email
            }

            const product = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path: `${req.file.path}`, owner };

            const createdProduct = await prodService.create(product);
            if (createdProduct) {
                return res.status(201).json({ status: "success", msg: 'Producto creado', payload: createdProduct });
            } else {
                return res.status(400).json({ status: "error", msg: 'El producto no cumple las condiciones para ser creado' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', msg: 'No se pudo crear el producto', error: error.message });
        }
    }*/

    create = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ status: "error", msg: 'Please upload a file' });
            }

            const { filename, path } = req.file;
            const { name, price, category, stock, status, code, description, title } = req.body;

            let owner = "admin"; // Default owner is admin

            // Verify user role
            const user = await userService.getById(req.session.user._id); // Assuming you have user ID in session
            if (!user) {
                return res.status(401).json({ status: 'error', msg: 'Unauthorized' });
            }

            if (user.role === 'premium') {
                owner = user.username; // Set owner to username if user is premium
            }

            const product = {
                name,
                price,
                category,
                stock,
                thumbnail: `http://localhost:8080/${filename}`,
                path,
                owner,
                status,
                code,
                description,
                title
            };

            const createdProduct = await prodService.create(product);
            return res.status(201).json({ status: 'success', msg: 'Product created', payload: createdProduct });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', msg: 'Error creating product', error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            const pid = req.params.pid
            const { price, stock, status, ...rest } = req.body
            const updatedProduct = await prodService.update({ pid, price, stock, status, rest })
            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ status: "error", msg: 'Product to update not found', payload: {} })
            }

            return res
                .status(200).
                json({ status: "success", msg: 'modified product', payload: updatedProduct })
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'could not update the product', error: error.message });
        }
    }
}

export const productsController = new ProductsController()

/*import { prodService } from "../services/products.service.js";
import { userService } from "../services/users.service.js";

class ProductsController {
    getAllProducts = async (req, res) => {
        try {
            const { limit, sort, page, category, stock } = req.query;

            let parsedLimit = parseInt(limit);
            let parsedPage = parseInt(page);

            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                parsedLimit = 10;
            }

            if (parsedLimit) {
                let limitProd = await prodService.getAllProducts(req, parsedLimit, sort, parsedPage, category, stock);
                return res.status(200).json({ status: "success", msg: 'limited number of products', payload: limitProd });
            } else {
                return res.status(400).json({ status: "error", msg: 'invalid limit parameter' });
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: "Error getting the products" });
        }
    }

    findOne = async (req, res) => {
        try {
            const pid = req.params.pid;
            const productFinder = await prodService.findOne(pid);
            if (productFinder) {
                return res
                    .status(200)
                    .json({ status: "success", msg: 'Product found', payload: productFinder });
            } else {
                return res
                    .status(400)
                    .json({ status: "error", msg: 'product not found' });
            }
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'the product could not be found', error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = await prodService.findOne(pid);

            // Verificar que el usuario es admin o dueño del producto
            if (req.session.user.role === 'admin' || (req.session.user.role === 'premium' && product.owner.toString() === req.session.user._id.toString())) {
                const deletedProduct = await prodService.delete(pid);
                return res
                    .status(200)
                    .json({ status: "success", msg: 'removed product', payload: deletedProduct });
            } else {
                return res.status(403).json({ status: 'error', msg: 'You do not have permission to delete this product' });
            }
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'could not delete product', error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ status: "error", msg: 'before upload a file to be able to modify the product' });
            }

            const name = req.file.filename;
            const owner = req.session.user.role === 'premium' ? req.session.user._id : null;
            const product = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path: `${req.file.path}`, owner };

            const createdProduct = await prodService.create(product);
            if (createdProduct) {
                return res
                    .status(201)
                    .json({ status: "success", msg: 'product created', payload: createdProduct });
            } else {
                return res
                    .status(400)
                    .json({ status: "error", msg: 'The product was not created because it does not meet the conditions' });
            }

        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'could not create product', error: error.message });
        }
    }


    update = async (req, res) => {
        try {
            const pid = req.params.pid;
            const { price, stock, status, ...rest } = req.body;
            const updatedProduct = await prodService.update({ pid, price, stock, status, rest });
            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ status: "error", msg: 'Product to update not found', payload: {} });
            }

            return res
                .status(200)
                .json({ status: "success", msg: 'modified product', payload: updatedProduct });
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'could not update the product', error: error.message });
        }
    }
}

export const productsController = new ProductsController();
*/
