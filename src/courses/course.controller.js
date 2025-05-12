import { response, request } from "express";
import Courses from "./course.model.js";

export const getCourses = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0, nombre } = req.query;
        const query = { status: true };

        const [total, courses] = await Promise.all([
            Courses.countDocuments(query),
            Courses.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({
                    path: 'publications',
                    select: '_id title',
                    match: { status: true }
                })
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener cursos',
            error
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Courses.findById(id)
            .populate({
                path: 'publications',
                select: '_id title',
                match: { status: true }
            });
        

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el curso',
            error
        });
    }
};

export const getCourseByName = async (req, res) => {
    try {
        const { nombre } = req.params;
        const course = await Courses.find({ 
            courseName: { $regex: nombre, $options: 'i' },
            status: true
        })
        .populate({
            path: 'publications',
            select: '_id title',
            match: { status: true }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar curso por nombre',
            error
        });
    }
};

export const updateCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;
        const course = await Courses.findByIdAndUpdate(id, data, { new: true });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            })
        }

        res.status(200).json({
            success: true,
            msg: 'Curso actualizado correctamente',
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el curso',
            error
        });
    }
};

export const deleteCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const searchCourse = await Courses.findById(id);

        if (!searchCourse) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }
        
        const updatedCourse = await Courses.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Curso desactivado exitosamente',
            course: updatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al desactivar el curso',
            error
        });
    }
};