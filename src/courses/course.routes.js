import { Router } from "express";
import { check } from "express-validator";
import { getCourses, getCourseById, getCourseByName, updateCourse, deleteCourse } from "./course.controller.js";
import { existeCourseById, noDuplicadoAlEditar } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get(
    "/",
    getCourses
);

router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCourseById),
        validarCampos

    ],
    getCourseById
)

router.get(
    "/nombre/:nombre",
    [
        check("nombre", "El nombre es requerido").not().isEmpty(),
        check("nombre", "El nombre debe ser texto").isString(),
        validarCampos
    ],
    getCourseByName
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCourseById),
        check("courseName", "El nombre es requerido").optional().not().isEmpty().custom(noDuplicadoAlEditar),
        check("courseName", "Máximo 60 caracteres").optional().isLength({ max: 60 }),
        check("description", "Máximo 160 caracteres").optional().isLength({ max: 160 }),
        validarCampos
    ],
    updateCourse
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCourseById),
        validarCampos
    ],
    deleteCourse
);

export default router;