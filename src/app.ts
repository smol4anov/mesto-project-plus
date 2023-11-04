import express from "express";
import mongoose from "mongoose";
import router from "routes";
require("dotenv").config();

const { PORT = 3000, BASE_PATH = "mongodb://localhost:27017/mynewdb" } =
  process.env;

mongoose.set("strictQuery", false);
mongoose.connect(BASE_PATH);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
