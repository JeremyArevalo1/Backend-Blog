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
                    courseName: "Tecnología",
                    description: "Domina hardware y software para resolver problemas técnicos con eficiencia.",
                    status: true
                },
                {
                    courseName: "Taller",
                    description: "Aprende programación práctica desarrollando proyectos reales desde cero.",
                    status: true 
                },
                {
                    courseName: "TICs", 
                    description: "Redes, seguridad y cloud computing para la era digital.", 
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