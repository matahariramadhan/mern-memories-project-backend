import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";

import postRoutes from "./routes/posts.js";

const app = express();

env.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);

const DATABASE_URL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.rqcs9.mongodb.net:27017,cluster0-shard-00-01.rqcs9.mongodb.net:27017,cluster0-shard-00-02.rqcs9.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-93xfde-shard-0&authSource=admin&retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  )
  .catch((error) => console.log(error));

mongoose.set("useFindAndModify", false);
