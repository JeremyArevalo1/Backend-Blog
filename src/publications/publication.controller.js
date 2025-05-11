import { response, request } from "express";
import Publication from "./publication.model.js";
import Course from "../courses/course.model.js";

export const getPublications = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
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

export const getPublicationsById = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);

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
        const publication = await Publication.findByIdAndUpdate(id, data, { new: true });
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: "Publicacion no encontrada"
            })
        }

        const course = await Course.findById(publication.associatedcourse);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso asociado no encontrado"
            });
        }

        const publicationResponseData = {
            _id: publication._id,
            title: publication.title,
            descriptionoftheactivity: publication.descriptionoftheactivity,
            courseName: course.courseName,
            creationDate: publication.creationDate,
            createdAt: publication.createdAt,
            updatedAt: publication.updatedAt
        };

        res.status(200).json({
            success: true,
            meg: "Publicacion actualizada correctamente",
            publication: publicationResponseData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicacion",
            error
        })
    }
}

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

        res.status(200).json({
            success: true,
            message: 'Publicacion eliminada correctamente',
            publication: updatePublication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicacion'
        })
    }
}