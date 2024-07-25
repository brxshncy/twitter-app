import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDb } from "./config/db.config";
import authRouter from "./routes/auth.route";

const app = express();

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT;

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
