/* eslint-disable no-console */
import express from "express";
import { CLOSE_DB, CONNECT_DB } from "./config/mongodb.js";
import exitHook from "async-exit-hook";

const START_SERVER = () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
  });

  app.listen(() => {
    console.log("Server is running at http://localhost:8000/");
  });

  exitHook(() => {
    CLOSE_DB();
  });
};

CONNECT_DB()
  .then(() => console.log("Connected to MongoDB Cloud Atlas!"))
  .then(() => START_SERVER())
  .catch((err) => {
    console.log(err, "error");
    process.exit(0);
  });
