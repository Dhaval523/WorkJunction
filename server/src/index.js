import express from "express";
import dotenv from "dotenv";
import  connectDB  from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import workerRouter from "./routes/workerRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", // your frontend
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api routes
app.use("/api/auth", authRouter);
app.use("/api/workers", workerRouter);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port " + PORT);
});
