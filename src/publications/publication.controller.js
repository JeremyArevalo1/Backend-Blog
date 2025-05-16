import { response, request } from "express";
import Publication from "./publication.model.js";
import Course from "../courses/course.model.js";
import Comment from "../comments/comment.model.js";

export const getPublications = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({
                    path: 'comments',
                    select: '_id nameUser comment creationDate',
                    match: { status: true }
                })
        ]);

        res.status(200).json({
            success: true,
            total,
            publications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener publicaciones',
            error
        });
    }
};

export const getPublicationsByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const publications = await Publication.find({
            associatedcourse: courseId,
            status: true
        }).populate({
            path: "comments",
            match: { status: true }
        });

        res.status(200).json({
            success: true,
            publications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener publicaciones por curso",
            error
        });
    }
};

export const getPublicationsByCourseName = async (req, res) => {
    const { name } = req.params;

    try {
        const publications = await Publication.find({
            status: true
        })
        .populate({
            path: 'associatedcourse',
            match: { courseName: name }, // Buscar por nombre del curso
            select: 'courseName'
        })
        .populate({
            path: "comments",
            match: { status: true }
        });

        // Filtrar publicaciones cuyo curso asociado no sea null (es decir, coincidió el nombre)
        const filteredPublications = publications.filter(pub => pub.associatedcourse);

        res.status(200).json({
            success: true,
            publications: filteredPublications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener publicaciones por nombre del curso",
            error
        });
    }
};

export const getPublicationsById = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id)
        .populate({
            path: 'comments',
            select: '_id nameUser comment creationDate',
            match: { status: true }
        });

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publicaciion no encontrada'
            })
        }

        res.status(200).json({
            success: true,
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar la publicacion',
            error
        })
    }
}

export const createPublication = async (req = request, res = response) => {
    try {
        const data = req.body;
        const course = await Course.findById(data.associatedcourse);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        const publication = new Publication({
            ...data,
            associatedcourse: course._id
        });

        await publication.save();

        await Course.findByIdAndUpdate(course._id, {
            $push: { publications: publication._id }
        });

        const publicationResponseData = {
            _id: publication._id,
            title: publication.title,
            descriptionoftheactivity: publication.descriptionoftheactivity,
            courseName: course.courseName,
            creationDate: publication.creationDate,
            expirationDate: publication.expirationDate,
            createdAt: publication.createdAt,
            updatedAt: publication.updatedAt
        };

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            publication: publicationResponseData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la publicación',
            error: error.message
        });
    }
}

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;
        const currentPublication = await Publication.findById(id);

        if (!currentPublication) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada"
            });
        }
        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true });

        if (currentPublication.status === false && updatedPublication.status === true) {
            await Comment.updateMany(
                { publication: id },
                { $set: { status: true } }
            );
        }

        const course = await Course.findById(updatedPublication.associatedcourse);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso asociado no encontrado"
            });
        }

        const publicationResponseData = {
            _id: updatedPublication._id,
            title: updatedPublication.title,
            descriptionoftheactivity: updatedPublication.descriptionoftheactivity,
            courseName: course.courseName,
            creationDate: updatedPublication.creationDate,
            expirationDate: updatedPublication.expirationDate,
            createdAt: updatedPublication.createdAt,
            updatedAt: updatedPublication.updatedAt,
            status: updatedPublication.status
        };

        res.status(200).json({
            success: true,
            msg: "Publicación actualizada correctamente",
            publication: publicationResponseData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicación",
            error
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicacion no en contrada'
            })
        }

        if (publication.status === false) {
            return res.status(400).json({
                success: false,
                message: 'La publicación ya está eliminada'
            });
        }
        
        const updatePublication = await Publication.findByIdAndUpdate(id, { status: false }, { new: true });

        await Comment.updateMany({ publication: id, status: true }, { $set: { status: false } });

        res.status(200).json({
            success: true,
            message: 'Publicacion eliminada correctamente y los comentarios tambien',
            publication: updatePublication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicacion',
            error
        })
    }
}