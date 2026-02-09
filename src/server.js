import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import assessmentRoutes from './routes/assessmentRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 User CRUD API is running");
});

app.use("/api/users", userRoutes);
// Mount Modular Routes
app.use('/api/assessments', assessmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🔥 Server running on http://localhost:${PORT}`)
);