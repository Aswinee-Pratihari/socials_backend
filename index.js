import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const port = 3000;
import User from "./controllers/User.js";
import Post from "./controllers/Post.js";
import "dotenv/config.js";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/users", User);
app.use("/posts", Post);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};

app.listen(port, () => {
  connectDB();
  // console.log(process.env.MONGO_URI)
});
