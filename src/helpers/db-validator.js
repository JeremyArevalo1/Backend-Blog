import Courses from "../courses/course.model.js";
import Publications from "../publications/publication.model.js";

export const existeCourseById = async (id = "") =>{
    const existeCurso = await Courses.findById(id);

    if (!existeCurso) {
        throw new Error(`El Curso con Id ${id} no existe`);
        
    }
}

export const existePublicationById = async (id = "") =>{
    const existePublication = await Publications.findById(id);

    if (!existePublication) {
        throw new Error(`La publicacion con Id ${id} no existe`);
        
    }
}

export const noDuplicadoAlEditar = async (courseName, { req }) => {
    const cursoExistente = await Courses.findOne({
        courseName: { $regex: new RegExp(`^${courseName}$`, 'i') },
        _id: { $ne: req.params.id },
        status: true
    });

    if (cursoExistente) {
        throw new Error(`Ya existe un curso llamado ${cursoExistente.courseName} `);
    }
};