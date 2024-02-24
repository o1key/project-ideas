/* eslint-disable no-console */
import express from "express";
import exitHook from "async-exit-hook";
import { env } from "./config/environment.js";
import { CLOSE_DB, CONNECT_DB } from "./config/mongodb.js";
import { APIs_V1 } from "./routes/v1/index.js";

const START_SERVER = () => {
  const app = express();

  app.use("/v1", APIs_V1);

  app.listen(env.PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.PORT}/`);
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
