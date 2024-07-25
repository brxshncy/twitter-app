import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("Mongo Uri is not yet set.");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`Mongo DB connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};
