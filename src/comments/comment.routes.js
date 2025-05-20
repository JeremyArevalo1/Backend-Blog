import { Router } from "express";
import { check } from "express-validator";
import { getComments, getCommentsById, getCommentsByUserName, createComments, updateComment, deleteComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCommentById } from "../helpers/db-validator.js";

const router = Router();

router.get(
    "/",
    getComments
);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCommentById),
        validarCampos
    ],
    getCommentsById
);

router.get(
    "/nameUser/:nameUser",
    [
        check("nameUser", "El nombre del usuario es requerido").not().isEmpty(),
        check("nameUser", "El nombre del usuario debe ser texto").isString(),
        validarCampos
    ],
    getCommentsByUserName
);

router.post(
    "/",
    [
        check("nameUser", "El nombre del usuario no puede exceder los 30 caracteres").isLength({ max: 30 }),
        check("comment", "El comentario es requerido").not().isEmpty(),
        check("comment", "El comentario no puede exceder los 150 caracteres").isLength({ max: 150 }),
        check("publication", "La publicacion es requerida").not().isEmpty(),
        check("publication", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    createComments
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        /*check("nameUser", "El nombre del usuario es requerido").not().isEmpty(),
        check("nameUser", "El nombre del usuario no puede exceder los 30 caracteres").isLength({ max: 30 }),*/
        check("comment", "El comentario es requerido").not().isEmpty(),
        check("comment", "El comentario no puede exceder los 150 caracteres").isLength({ max: 150 }),
        validarCampos
    ],
    updateComment
);

router.delete(
    "/:id",
    [
        check("id", "No es un id valido").isMongoId(),
        validarCampos
    ],
    deleteComment
)

export default router;