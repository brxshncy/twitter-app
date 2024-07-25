import express from "express";
import "dotenv/config";
import cors from "cors";
import cookiePaser from "cookie-parser";
import { connectDb } from "./config/db.config";
import authRouter from "./routes/auth.route";
import tweetRoute from "./routes/tweet.route";

const app = express();

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookiePaser());
const PORT = process.env.PORT;

app.use("/api/auth", authRouter);
app.use("/api/tweet", tweetRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
