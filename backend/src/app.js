import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";

const app = express();



// app.use( cors({ origin: process.env.CLIENT_URL,credentials: true,}));

//temperarily allow all cors
app.use(cors());
// app.use(helmet());

//temperaorily
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

//health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CodingPlate API Running"
    });
});

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/test-cases", testCaseRoutes);

//404
app.use(notFound);

app.use(errorHandler);


export default app;