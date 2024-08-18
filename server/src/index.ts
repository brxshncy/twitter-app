import express from "express";
import { connectDB } from "./configs/db.config";
import cors from "cors";
import "dotenv/config";
import authRoute from "./routes/auth.route";
import { enableCloudinary } from "./configs/cloudinary.config";
import userRoutes from "./routes/user.route";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
enableCloudinary();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());
app.use("/api/user", authRoute);
app.use("/api/user", userRoutes);
app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
