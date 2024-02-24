import express from "express";
import { boardRoute } from "./boardRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).json({
    message: "Test API",
  });
});

// Board APIs
Router.use("/boards", boardRoute);

export const APIs_V1 = Router;
