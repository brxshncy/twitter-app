import express from "express";
import "dotenv/config";
import cors from "cors";
import cookiePaser from "cookie-parser";
import { connectDb } from "./config/db.config";
import authRouter from "./routes/auth.route";
import tweetRoute from "./routes/tweet.route";
import userRoutes from "./routes/user.route";
import { enableCloudinary } from "./config/cloudinary.config";

const app = express();

connectDb();
enableCloudinary();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookiePaser());
const PORT = process.env.PORT;

app.use("/api/auth", authRouter);
app.use("/api/tweet", tweetRoute);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
