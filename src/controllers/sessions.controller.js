import CurrentDTO from "../DAO/DTO/current.dto.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from "../utils/logger.js";

dotenv.config();
class SessionsController {
    get = async (req, res) => {
        try {
            if (req.session.user) {
                const dataUser = req.session.user
                const { username } = dataUser
                const existUser = true

                return res.render('index', { existUser, username })
            } else {
                return res.render('index')
            }
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getLogin = (req, res) => {
        try {
            return res.render('login')
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }

    }

    postLogin = (req, res) => {
        try {

            const user = req.user; // Obtener el usuario desde req.user
            req.session.user = {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                role: req.user.role,
                cart_ID: req.user.cart_ID
            };
            //lo que se agrego nuevo
            req.session.user = user;
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ status: 'success', token });
            //esto ya estaba
            // return res.redirect('/views/products');

        } catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error });
        }
    }

    getRegister = (req, res) => {
        try {
            return res.render('register')
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    postRegister = (req, res) => {
        const user = req.user; // Obtener el usuario desde req.user
        try {
            req.session.user = { _id: req.user._id, username: req.user.username, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, role: req.user.role, cart_ID: req.user.cart_ID };
            return res.redirect('/views/products');
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getLogout = (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.json({ status: 'Logout ERROR', body: err })
            }
            return res.redirect('/login');
        })
    }

    getCurrent = async (req, res) => {
        try {
            const dataUser = req.session.user
            const currentDTO = new CurrentDTO(dataUser)
            const { first_name, last_name, username, email, age, role } = currentDTO

            return res.render('profile', { first_name, last_name, username, email, age, role })
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getGithubCallback = (req, res) => {
        try {

            //const user = req.user; // Obtener el usuario desde req.user-lo nuevo
            req.session.user = {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                role: req.user.role,
                cart_ID: req.user.cart_ID
            };

            //lo nuevo
            //const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            //res.status(200).json({ status: 'success', token });
            //lo que estaba
            return res.redirect('/views/products');
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }

    }

    getError = (req, res) => {
        try {
            const { msg } = req.query;
            return res.render('errorLogin', { msg });
        }
        catch (error) {
            logger.error(`Error creating message: ${error.message}`)
            return res.status(500).json({ status: "error", msg: error })
        }

    }
}

export const sessionsController = new SessionsController()