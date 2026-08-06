import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(notFound);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CodingPlate API Running"
    });
});

export default app;