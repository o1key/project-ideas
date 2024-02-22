import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";

// Khởi tạo một đối client để connect tới MongoDB
let trelloDatabaseInstance = null;

const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await client.connect();

  trelloDatabaseInstance = client.db();
};

export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error("Must connect to Database first!");
  return trelloDatabaseInstance;
};

export const CLOSE_DB = async () => await client.close();
