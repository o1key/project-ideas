import dotenv from "dotenv";
dotenv.config();

export const env = {
  APP_HOST: process.env.APP_HOST,
  PORT: process.env.APP_PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
};
