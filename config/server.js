import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import limiter from "../src/middlewares/validar-cant-peticiones.js";
import courseRoutes from "../src/courses/course.routes.js";
import publicationRoutes from "../src/publications/publication.routes.js";
import commentRoutes from "../src/comments/comment.routes.js";
import checkExpiredPublications from "../src/jobs/checkExpiredPublications.js";


const middlewares = (app) => {
    app.use(express.urlencoded({ extended : false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/blogdeaprendizaje/v1/courses', courseRoutes);
    app.use('/blogdeaprendizaje/v1/publications', publicationRoutes);
    app.use('/blogdeaprendizaje/v1/comments', commentRoutes);

}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexion exitosa con la base de datos');
    } catch (error) {
        console.log('Error al conectar con la base de datos', error);
    }
}

export const initserver = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        checkExpiredPublications();
        routes(app);
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }

}