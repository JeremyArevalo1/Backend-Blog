import mongoose from "mongoose";
import Courses from "../src/courses/course.model.js"

export const dbConnection = async() => {
    try {
        mongoose.connection.on('error', () => {
            console.log("MongoDB | could not be connected to MongoDB");
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log("Mongo | Try connection")
        });
        mongoose.connection.on('connected', () => {
            console.log("Mongo | connected to MongoDB")
        });
        mongoose.connection.on('open', () => {
            console.log("Mongo | connected to database")
        });
        mongoose.connection.on('reconnected', () => {
            console.log("Mongo | reconnected to MongoDB")
        });
        mongoose.connection.on('disconnected', () => {
            console.log("Mongo | disconnected")
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

        await createInitialCourses();

    } catch (error) {
        console.log('Database connection failed', error);
    }
};

const createInitialCourses = async () => {
    try {
        const initialCourses = await Courses.findOne();

        if (!initialCourses) {
            const createCourses = [
                {
                    courseName: "Tecnologia",
                    description: "Asignatura que desarrolla el pensamiento creativo y técnico, integrando ciencia y herramientas digitales para resolver problemas del entorno.",
                    status: true
                },
                {
                    courseName: "Taller",
                    description: "Espacio práctico donde los estudiantes fortalecen habilidades en informática mediante actividades aplicadas y trabajo colaborativo.",
                    status: true 
                },
                {
                    courseName: "Practica Supervisada", 
                    description: "Espacio formativo donde los estudiantes aplican sus conocimientos en informática mediante proyectos reales, fortaleciendo habilidades técnicas y profesionales.", 
                    status: true 
                }
            ];

            await Courses.insertMany(createCourses);
            console.log("✅😁 Cursos del area tecnica creados exitosamente");
        } else {
            console.log("❌🙄 Ya existen los cursos del area tecnica en la base de datos");
        }
    } catch (error) {
        console.error("🤥 Error al crear cursos del area tecnica:", error);
    }
}