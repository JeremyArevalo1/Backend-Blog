import { response, request } from "express";
import Comments from "./comment.model.js";
import Publication from "../publications/publication.model.js";

export const getComments = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, comments] = await Promise.all([
            Comments.countDocuments(query),
            Comments.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los comentarios',
            error
        });
    }
};

export const getCommentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            comment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar el comentario',
            error
        })
    }
};

export const getCommentsByUserName = async (req, res) => {
    try {
        const { nameUser } = req.params;
        const comment = await Comments.find({
            nameUser: { $regex: nameUser, $options: "i"},
            status: true
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar los comentarios de este usuario',
            error
        })
    }
}

export const createComments = async (req, res) => {
    try {
        const data = req.body;
        const publications = await Publication.findById(data.publication);

        if (!publications) {
            return res.status({
                success: false,
                msg: 'Publicacion no encontrada'
            })
        }

        const comment = new Comments({
            ...data,
            publication: publications._id
        })

        await comment.save();

        await Publication.findByIdAndUpdate(publications._id, {
            $push: { comments: comment._id }
        });

        const commentResponseData = {
            _id: comment._id,
            nameUser: comment.nameUser,
            comment: comment.comment,
            publication: publications.title,
            creationDate: publications.creationDate,
            createdAt: publications.createdAt,
            updatedAt: publications.updatedAt
        }

        res.status(201).json({
            success: true,
            msg: 'Se creo el comentario correctamente',
            comment: commentResponseData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear el comentario'
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, nameUser, ...data} = req.body;
        const comment = await Comments.findByIdAndUpdate(id, data, { new: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado'
            })
        }

        const publication = await Publication.findById(comment.publication);

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publicacion no encontrada'
            })
        }

        const commentResponseData = {
            _id: comment._id,
            nameUser: comment.nameUser,
            comment: comment.comment,
            publication: publication.title,
            creationDate: publication.creationDate,
            createdAt: publication.createdAt,
            updatedAt: publication.updatedAt
        }

        res.status(200).json({
            success: true,
            msg: 'Comentario actualizado correctamente',
            comment: commentResponseData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el comentario',
            error
        })
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado'
            })
        }

        if (comment.status === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este comentario ya fue eliminado'
            });
        }

        const updateComment = await Comments.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
            comment: updateComment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar el comentario',
            error
        })
    }
}