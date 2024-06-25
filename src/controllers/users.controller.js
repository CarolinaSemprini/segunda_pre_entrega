import CustomError from "../services/errors/custom-error.js";
import EErros from "../services/errors/enums.js";
import { userService } from "../services/users.service.js";

class UsersController {
    getAll = async (req, res) => {
        try {
            const users = await userService.getAll();
            return res.status(200).json({
                status: "success",
                msg: "listado de usuarios",
                payload: users,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                payload: {},
            });
        }
    }

    getOne = async (req, res) => {
        try {
            const users = await userService.getOne(req.params.username);
            return res.status(200).json({
                status: "success",
                msg: "listado de un usuario",
                payload: users,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                payload: {},
            });
        }
    }

    create = async (req, res) => {
        try {
            const { first_name, last_name, username, email, age, password } = req.body;

            // Verificar si todos los campos obligatorios están presentes
            if (!first_name || !last_name || !email || !age || !password) {
                // Si falta algún campo, lanzar un error personalizado
                throw new CustomError({
                    name: "User creation error",
                    cause: "Por favor complete todos los campos obligatorios.",
                    message: "Error al intentar crear un usuario",
                    code: EErros.INVALID_TYPES_ERROR,
                });
            }

            // Verificar si el correo electrónico ya está registrado
            const existingUser = await userService.getOne(email);
            if (existingUser) {
                // Si el correo electrónico ya existe, lanzar un error
                throw new CustomError({
                    name: "User creation error",
                    cause: "El correo electrónico ya está registrado.",
                    message: "Error al intentar crear un usuario",
                    code: EErros.INVALID_TYPES_ERROR,
                });
            }

            // Crear el usuario si pasa todas las validaciones
            const userCreated = await userService.create({ first_name, last_name, username, email, age, password });

            return res.status(201).json({
                status: "success",
                msg: "Usuario creado exitosamente",
                payload: userCreated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "Ocurrió un error al intentar crear el usuario",
                payload: {},
            });
        }
    }

    getById = async (req, res) => {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: "error",
                    msg: "Invalid ID format",
                    payload: {},
                });
            }
            const user = await userService.getById(id);
            if (user) {
                return res.status(200).json({
                    status: "success",
                    msg: "Usuario encontrado",
                    payload: user,
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    msg: "Usuario no encontrado",
                    payload: {},
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "Error al obtener el usuario",
                payload: {},
            });
        }
    }

    /*update = async (req, res) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, username, email, age, password } = req.body;
            if (!first_name || !last_name || !email || !id) {
                console.log(
                    "validation error: please complete firstName, lastname and email."
                );
                return res.status(404).json({
                    status: "error",
                    msg: "please complete firstName, lastname and email.",
                    payload: {},
                });
            }
            try {
                const userUpdated = await userService.update({ id, first_name, last_name, email }
                );
                if (userUpdated.matchedCount > 0) {
                    return res.status(201).json({
                        status: "success",
                        msg: "user update",
                        payload: {},
                    })
                } else {
                    return res.status(404).json({
                        status: "error",
                        msg: "user not found",
                        payload: {},
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    msg: "db server error while updating user",
                    payload: {},
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                payload: {},
            });
        }
    }*/
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, username, email, age, password } = req.body;

            // Validar que los campos necesarios estén presentes y no estén vacíos
            if (!first_name || !last_name || !email || !id) {
                console.log(
                    "Error de validación: por favor complete nombre, apellido y correo electrónico."
                );
                return res.status(400).json({
                    status: "error",
                    msg: "Por favor complete nombre, apellido y correo electrónico.",
                    payload: {},
                });
            }

            // Actualizar el usuario en la base de datos
            const updatedUser = await userService.update({ id, first_name, last_name, email });

            if (updatedUser) {
                return res.status(200).json({
                    status: "success",
                    msg: "Usuario actualizado correctamente",
                    payload: updatedUser,
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    msg: "Usuario no encontrado",
                    payload: {},
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "Error interno del servidor al actualizar el usuario",
                payload: {},
            });
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            await userService.delete({ id });
            return res.status(200).json({
                status: "success",
                msg: "user deleted",
                payload: {},
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                payload: {},
            });
        }
    }
}

export const usersController = new UsersController();
