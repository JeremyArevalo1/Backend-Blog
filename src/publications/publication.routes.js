import { Router } from "express";
import { check } from "express-validator";
import { getPublications, getPublicationsById, createPublication, updatePublication, deletePublication } from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existePublicationById } from "../helpers/db-validator.js";

const router = Router();

router.get(
    "/",
    getPublications
);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existePublicationById),
        validarCampos
    ],
    getPublicationsById
);

router.post(
    "/",
    [
        check("title", "El título es requerido").not().isEmpty(),
        check("title", "El título no puede exceder los 50 caracteres").isLength({ max: 50 }),
        check("descriptionoftheactivity", "La descripción es requerida").not().isEmpty(),
        check("descriptionoftheactivity", "La descripción no puede exceder los 150 caracteres").isLength({ max: 150 }),
        check("associatedcourse", "El curso asociado es requerido").not().isEmpty(),
        check("associatedcourse", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    createPublication
)

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("title", "El título es requerido").not().isEmpty(),
        check("title", "El título no puede exceder los 50 caracteres").isLength({ max: 50 }),
        check("descriptionoftheactivity", "La descripción es requerida").not().isEmpty(),
        check("descriptionoftheactivity", "La descripción no puede exceder los 150 caracteres").isLength({ max: 150 }),
        check("associatedcourse", "El curso asociado es requerido").not().isEmpty(),
        check("associatedcourse", "No es un ID válido").isMongoId(),        
        validarCampos
    ],
    updatePublication
);

router.delete(
    "/:id",
    [
        check("id", "No es un id valido").isMongoId(),
        validarCampos
    ],
    deletePublication
)
export default router;